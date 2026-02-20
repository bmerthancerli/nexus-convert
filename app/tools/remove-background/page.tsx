"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import { Footer } from "@/app/components/footer";
import { NavAuth } from "@/app/components/nav-auth";

type State = "idle" | "ready" | "processing" | "done" | "error";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function isImageFile(file: File): boolean {
  const n = file.name.toLowerCase();
  const t = file.type.toLowerCase();
  return IMAGE_EXT.some((e) => n.endsWith(e)) || ["image/jpeg", "image/png", "image/webp"].includes(t);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RemoveBackgroundPage() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError(`File is too large. Maximum ${MAX_MB} MB is supported.`);
      setState("error");
      return;
    }
    if (!isImageFile(f)) {
      setError("Please upload an image file (JPG, PNG, WebP).");
      setState("error");
      return;
    }
    setFile(f);
    setState("ready");
    setError(null);
    setResultBlob(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError(`File is too large. Maximum ${MAX_MB} MB is supported.`);
      setState("error");
      return;
    }
    if (!isImageFile(f)) {
      setError("Please upload an image file (JPG, PNG, WebP).");
      setState("error");
      return;
    }
    setFile(f);
    setState("ready");
    setError(null);
    setResultBlob(null);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!file) return;
    setState("processing");
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Processing failed.");
      }

      const blob = await res.blob();
      setResultBlob(blob);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
      setState("error");
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? file.name.replace(/\.[^.]+$/, "") + "_no-bg.png" : "removed-bg.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [resultBlob, file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setState("idle");
    setError(null);
    setResultBlob(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const dropProps =
    state === "idle" || state === "ready" || state === "error"
      ? { onDragEnter: (e: React.DragEvent) => e.preventDefault(), onDragOver: handleDragOver, onDrop: handleDrop }
      : {};

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(15 23 42) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 hidden opacity-[0.06] dark:block"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      <header className="relative border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">
            NexusConvert
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Arka Plan Silici (AI)</span>
            <NavAuth />
          </div>
        </div>
      </header>

      <main {...dropProps} className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Arka Plan Silici (AI)
          </h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Remove the background from your image with AI. Download as transparent PNG.
          </p>

          <div
            onClick={() => (state === "idle" || state === "ready" ? inputRef.current?.click() : undefined)}
            className={`relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-all ${
              state === "idle" || state === "ready" || state === "error"
                ? "cursor-pointer border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-600 dark:bg-slate-800/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
                : "cursor-default border-slate-200 bg-slate-50/30 dark:border-slate-700 dark:bg-slate-800/20"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {state === "idle" && (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
                  <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Drag your image here</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to select</p>
              </>
            )}

            {state === "ready" && file && (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
                  <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="truncate px-4 text-lg font-medium text-slate-900 dark:text-white" title={file.name}>{file.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleProcess(); }}
                  className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Remove Background
                </button>
              </>
            )}

            {state === "processing" && (
              <>
                <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400" />
                <p className="font-medium text-slate-700 dark:text-slate-300">AI is removing the background...</p>
              </>
            )}

            {state === "done" && resultBlob && (
              <>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
                  <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">Done</p>
                <button
                  onClick={handleDownload}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={handleReset}
                  className="mt-4 text-sm text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  Upload new file
                </button>
              </>
            )}

            {state === "error" && (
              <>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
                  <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="max-w-xs px-4 text-sm text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleReset(); }}
                  className="mt-6 rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Tekrar Dene
                </button>
              </>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Your files are processed on the server. They are stored in accordance with our privacy policy.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
