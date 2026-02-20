"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import { formatFileSize, checkFileSize, getFFmpegErrorMessage } from "@/app/components/tool-page";
import { Footer } from "@/app/components/footer";
import { NavAuth } from "@/app/components/nav-auth";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];
const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function isVideoFile(file: File): boolean {
  return VIDEO_EXT.some((e) => file.name.toLowerCase().endsWith(e));
}

function isImageFile(file: File): boolean {
  return IMG_EXT.some((e) => file.name.toLowerCase().endsWith(e));
}

export default function VideoyaFiligranPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "ready" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [isLoadingFFmpeg, setIsLoadingFFmpeg] = useState(false);
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDragOver = (e: DragEvent) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"; };
    const onDrop = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", onDragOver, { passive: false });
    window.addEventListener("drop", onDrop, { passive: false });
    return () => { window.removeEventListener("dragover", onDragOver); window.removeEventListener("drop", onDrop); };
  }, []);

  const handleVideoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (checkFileSize(f)) return;
    if (!isVideoFile(f)) return;
    setVideoFile(f);
    setState(videoFile || imageFile ? "ready" : "idle");
    setError(null);
  }, [videoFile, imageFile]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (checkFileSize(f, 5)) return;
    if (!isImageFile(f)) return;
    setImageFile(f);
    setState(videoFile || imageFile ? "ready" : "idle");
    setError(null);
  }, [videoFile, imageFile]);

  const handleConvert = useCallback(async () => {
    if (!videoFile || !imageFile) {
      setError("Please upload a video and a watermark image.");
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
      const imgExt = imageFile.name.split(".").pop() || "png";

      await ffmpeg.writeFile(`video.${videoExt}`, await fetchFileUtil(videoFile));
      await ffmpeg.writeFile(`logo.${imgExt}`, await fetchFileUtil(imageFile));

      await ffmpeg.exec([
        "-i", `video.${videoExt}`,
        "-i", `logo.${imgExt}`,
        "-filter_complex", "[1:v]scale=120:-1[logo];[0:v][logo]overlay=W-w-10:H-h-10",
        "-c:a", "copy",
        "output.mp4"
      ]);

      const out = await ffmpeg.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);

      await ffmpeg.deleteFile(`video.${videoExt}`);
      await ffmpeg.deleteFile(`logo.${imgExt}`);
      await ffmpeg.deleteFile("output.mp4");

      setOutputBlob(new Blob([bytes], { type: "video/mp4" }));
      setState("done");
    } catch (err) {
      setIsLoadingFFmpeg(false);
      setError(getFFmpegErrorMessage(err, "video"));
      setState("error");
    }
  }, [videoFile, imageFile]);

  const handleDownload = useCallback(() => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = videoFile ? videoFile.name.replace(/\.[^.]+$/, "") + "_watermark.mp4" : "watermark.mp4";
    a.click();
    URL.revokeObjectURL(url);
  }, [outputBlob, videoFile]);

  const handleReset = useCallback(() => {
    setVideoFile(null);
    setImageFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
    setOutputBlob(null);
    if (videoRef.current) videoRef.current.value = "";
    if (imageRef.current) imageRef.current.value = "";
  }, []);

  const ready = !!videoFile && !!imageFile;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none fixed inset-0 opacity-[0.04] dark:hidden" style={{ backgroundImage: `linear-gradient(to right, rgb(15 23 42) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} aria-hidden />
      <div className="pointer-events-none fixed inset-0 hidden opacity-[0.06] dark:block" style={{ backgroundImage: `linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} aria-hidden />

      <header className="relative border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">NexusConvert</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Videoya Filigran</span>
            <NavAuth />
          </div>
        </div>
      </header>

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Videoya Filigran Ekle</h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">Add a watermark (logo) to the bottom-right corner of your video.</p>

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
                    <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Watermark (image)</label>
                    <input ref={imageRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/*" onChange={handleImageSelect} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:text-indigo-700 dark:file:bg-indigo-900/40 dark:file:text-indigo-300" />
                    {imageFile && <p className="mt-1 truncate text-xs text-slate-500">{imageFile.name} ({formatFileSize(imageFile.size)})</p>}
                  </div>
                </div>
                <button onClick={handleConvert} disabled={!ready} className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  Filigran Ekle
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
