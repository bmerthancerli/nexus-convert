"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import { formatFileSize, checkFileSize, getFFmpegErrorMessage } from "@/app/components/tool-page";
import { Footer } from "@/app/components/footer";
import { NavAuth } from "@/app/components/nav-auth";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];
const AUDIO_EXT = [".mp3", ".wav", ".m4a"];

function isVideoFile(file: File): boolean {
  return VIDEO_EXT.some((e) => file.name.toLowerCase().endsWith(e));
}

function isAudioFile(file: File): boolean {
  return AUDIO_EXT.some((e) => file.name.toLowerCase().endsWith(e));
}

export default function VideoyaSesEklePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "ready" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [isLoadingFFmpeg, setIsLoadingFFmpeg] = useState(false);
  const videoRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDragOver = (e: DragEvent) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"; };
    const onDrop = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", onDragOver, { passive: false });
    window.addEventListener("drop", onDrop, { passive: false });
    return () => { window.removeEventListener("dragover", onDragOver); window.removeEventListener("drop", onDrop); };
  }, []);

  const handleVideoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || checkFileSize(f) || !isVideoFile(f)) return;
    setVideoFile(f);
    setState("ready");
    setError(null);
  }, []);

  const handleAudioSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || checkFileSize(f) || !isAudioFile(f)) return;
    setAudioFile(f);
    setState("ready");
    setError(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!videoFile || !audioFile) {
      setError("Please upload a video and an audio file.");
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

      const videoExt = videoFile.name.split(".").pop() || "mp4";
      const audioExt = audioFile.name.split(".").pop() || "mp3";

      await ffmpeg.writeFile(`video.${videoExt}`, await fetchFileUtil(videoFile));
      await ffmpeg.writeFile(`audio.${audioExt}`, await fetchFileUtil(audioFile));

      await ffmpeg.exec([
        "-i", `video.${videoExt}`,
        "-i", `audio.${audioExt}`,
        "-c:v", "copy",
        "-c:a", "aac",
        "-shortest",
        "output.mp4"
      ]);

      const out = await ffmpeg.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);

      await ffmpeg.deleteFile(`video.${videoExt}`);
      await ffmpeg.deleteFile(`audio.${audioExt}`);
      await ffmpeg.deleteFile("output.mp4");

      setOutputBlob(new Blob([bytes], { type: "video/mp4" }));
      setState("done");
    } catch (err) {
      setIsLoadingFFmpeg(false);
      setError(getFFmpegErrorMessage(err, "video"));
      setState("error");
    }
  }, [videoFile, audioFile]);

  const handleDownload = useCallback(() => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = videoFile ? videoFile.name.replace(/\.[^.]+$/, "") + "_with_audio.mp4" : "video_with_audio.mp4";
    a.click();
    URL.revokeObjectURL(url);
  }, [outputBlob, videoFile]);

  const handleReset = useCallback(() => {
    setVideoFile(null);
    setAudioFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
    setOutputBlob(null);
    if (videoRef.current) videoRef.current.value = "";
    if (audioRef.current) audioRef.current.value = "";
  }, []);

  const ready = !!videoFile && !!audioFile;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none fixed inset-0 opacity-[0.04] dark:hidden" style={{ backgroundImage: `linear-gradient(to right, rgb(15 23 42) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} aria-hidden />
      <div className="pointer-events-none fixed inset-0 hidden opacity-[0.06] dark:block" style={{ backgroundImage: `linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} aria-hidden />

      <header className="relative border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">NexusConvert</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Videoya Ses Ekle</span>
            <NavAuth />
          </div>
        </div>
      </header>

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Videoya Ses Ekle</h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">Add an audio track to a silent video or replace the video&apos;s audio.</p>

          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 dark:border-slate-600 dark:bg-slate-800/30">
            {state === "idle" || state === "ready" ? (
              <>
                <div className="grid w-full max-w-md gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Video</label>
                    <input ref={videoRef} type="file" accept=".mp4,.webm,.avi,.mov,.mkv,video/*" onChange={handleVideoSelect} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:text-indigo-700 dark:file:bg-indigo-900/40 dark:file:text-indigo-300" />
                    {videoFile && <p className="mt-1 truncate text-xs text-slate-500">{videoFile.name} ({formatFileSize(videoFile.size)})</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Ses (MP3, WAV, M4A)</label>
                    <input ref={audioRef} type="file" accept=".mp3,.wav,.m4a,audio/*" onChange={handleAudioSelect} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:text-indigo-700 dark:file:bg-indigo-900/40 dark:file:text-indigo-300" />
                    {audioFile && <p className="mt-1 truncate text-xs text-slate-500">{audioFile.name} ({formatFileSize(audioFile.size)})</p>}
                  </div>
                </div>
                <button onClick={handleConvert} disabled={!ready} className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  Ses Ekle
                </button>
              </>
            ) : (state === "converting" || isLoadingFFmpeg) ? (
              <>
                <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400" />
                <p className="font-medium text-slate-700 dark:text-slate-300">{isLoadingFFmpeg ? "Loading FFmpeg..." : "Processing..."}</p>
                <div className="mt-6 w-full max-w-xs">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">%{progress}</p>
                </div>
              </>
            ) : state === "done" ? (
              <>
                <p className="font-semibold text-slate-900 dark:text-white">Done</p>
                <button onClick={handleDownload} className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700">Download</button>
                <button onClick={handleReset} className="mt-4 text-sm text-slate-500 underline">Yeni dosyalar</button>
              </>
            ) : (
              <>
                <p className="max-w-xs text-sm text-red-600 dark:text-red-400">{error}</p>
                <button onClick={handleReset} className="mt-6 rounded-xl border border-slate-300 px-6 py-2.5 font-medium dark:border-slate-600">Tekrar Dene</button>
              </>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">Your files are processed on your device.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
