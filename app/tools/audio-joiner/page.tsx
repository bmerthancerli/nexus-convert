"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import { formatFileSize, checkFileSize, getFFmpegErrorMessage } from "@/app/components/tool-page";
import { Footer } from "@/app/components/footer";
import { NavAuth } from "@/app/components/nav-auth";

const AUDIO_EXT = [".mp3", ".wav", ".m4a"];

function isAudioFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return AUDIO_EXT.some((e) => n.endsWith(e));
}

export default function AudioJoinerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<"idle" | "ready" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [isLoadingFFmpeg, setIsLoadingFFmpeg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    };
    const onDrop = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", onDragOver, { passive: false });
    window.addEventListener("drop", onDrop, { passive: false });
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList?.length) return;
    const valid: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (checkFileSize(f)) continue;
      if (!isAudioFile(f)) continue;
      valid.push(f);
    }
    if (valid.length) {
      setFiles((prev) => [...prev, ...valid]);
      setState("ready");
      setError(null);
    }
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setState(next.length ? "ready" : "idle");
      return next;
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles]
  );

  const handleConvert = useCallback(async () => {
    if (files.length < 2) {
      setError("En az 2 ses dosyası ekleyin.");
      return;
    }

    setState("converting");
    setProgress(0);
    setError(null);
    setIsLoadingFFmpeg(true);

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.9/dist/umd";

      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setIsLoadingFFmpeg(false);

      const { fetchFile: fetchFileUtil } = await import("@ffmpeg/util");

      for (let i = 0; i < files.length; i++) {
        const data = await fetchFileUtil(files[i]);
        const ext = files[i].name.split(".").pop() || "mp3";
        await ffmpeg.writeFile(`input_${i}.${ext}`, data);
        await ffmpeg.exec(["-i", `input_${i}.${ext}`, "-c:a", "pcm_s16le", "-ar", "44100", `input_${i}.wav`]);
        await ffmpeg.deleteFile(`input_${i}.${ext}`);
      }

      const listContent = files.map((_, i) => `file 'input_${i}.wav'`).join("\n");
      await ffmpeg.writeFile("list.txt", new TextEncoder().encode(listContent));
      await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", "list.txt", "-acodec", "libmp3lame", "-qscale:a", "2", "output.mp3"]);

      const out = await ffmpeg.readFile("output.mp3");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);

      for (let i = 0; i < files.length; i++) await ffmpeg.deleteFile(`input_${i}.wav`);
      await ffmpeg.deleteFile("list.txt");
      await ffmpeg.deleteFile("output.mp3");

      setOutputBlob(new Blob([bytes], { type: "audio/mpeg" }));
      setOutputFileName("merged.mp3");
      setState("done");
    } catch (err) {
      setIsLoadingFFmpeg(false);
      setError(getFFmpegErrorMessage(err, "ses"));
      setState("error");
    }
  }, [files]);

  const handleDownload = useCallback(() => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputFileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [outputBlob, outputFileName]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setState("idle");
    setProgress(0);
    setError(null);
    setOutputBlob(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const dropZoneProps =
    state === "idle" || state === "ready" || state === "error"
      ? { onDragEnter: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, onDragOver: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = "copy"; }, onDrop: handleDrop }
      : {};

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none fixed inset-0 opacity-[0.04] dark:hidden" style={{ backgroundImage: `linear-gradient(to right, rgb(15 23 42) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} aria-hidden />
      <div className="pointer-events-none fixed inset-0 hidden opacity-[0.06] dark:block" style={{ backgroundImage: `linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} aria-hidden />

      <header className="relative border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">NexusConvert</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Ses Birleştirici</span>
            <NavAuth />
          </div>
        </div>
      </header>

      <main {...dropZoneProps} className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Ses Birleştirici</h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">Birden fazla ses dosyasını tek MP3 dosyasında birleştirin. MP3, WAV, M4A desteklenir.</p>

          <div
            onClick={() => (state === "idle" || state === "ready" ? inputRef.current?.click() : undefined)}
            className={`relative flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-all ${
              state === "idle" || state === "ready" || state === "error"
                ? "cursor-pointer border-slate-300 bg-slate-50/50 hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-800/30 dark:hover:border-indigo-500"
                : "cursor-default border-slate-200 dark:border-slate-700"
            }`}
          >
            <input ref={inputRef} type="file" accept=".mp3,.wav,.m4a,audio/*" multiple onChange={handleFileSelect} className="hidden" />

            {state === "idle" && (
              <>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Ses dosyalarınızı sürükleyin veya tıklayın</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">En az 2 ses (MP3, WAV, M4A)</p>
              </>
            )}

            {state === "ready" && (
              <>
                <div className="w-full space-y-2 px-4 py-2 max-h-48 overflow-y-auto">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-800">
                      <span className="truncate text-sm text-slate-700 dark:text-slate-300">{f.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{formatFileSize(f.size)}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-red-500 hover:text-red-700">Kaldır</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleConvert(); }}
                  disabled={files.length < 2}
                  className="mt-4 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  Birleştir
                </button>
                <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="mt-2 text-sm text-slate-500 underline">Daha fazla ekle</button>
              </>
            )}

            {(state === "converting" || isLoadingFFmpeg) && (
              <>
                <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400" />
                <p className="font-medium text-slate-700 dark:text-slate-300">{isLoadingFFmpeg ? "FFmpeg yükleniyor..." : "Birleştiriliyor..."}</p>
                <div className="mt-6 w-full max-w-xs">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">%{progress}</p>
                </div>
              </>
            )}

            {state === "done" && (
              <>
                <p className="font-semibold text-slate-900 dark:text-white">İşlem tamamlandı</p>
                <button onClick={handleDownload} className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700">İndir</button>
                <button onClick={handleReset} className="mt-4 text-sm text-slate-500 underline">Yeni dosyalar yükle</button>
              </>
            )}

            {state === "error" && (
              <>
                <p className="max-w-xs px-4 text-sm text-red-600 dark:text-red-400">{error}</p>
                <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="mt-6 rounded-xl border border-slate-300 px-6 py-2.5 font-medium dark:border-slate-600">Tekrar Dene</button>
              </>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">Dosyalarınız cihazınızda işlenir.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
