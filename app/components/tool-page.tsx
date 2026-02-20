"use client";

import Link from "next/link";
import { Footer } from "@/app/components/footer";
import { NavAuth } from "@/app/components/nav-auth";
import { useState, useCallback, useRef, useEffect, ReactNode } from "react";

export type ConvertState = "idle" | "ready" | "converting" | "done" | "error";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_FILE_SIZE_MB = 100;

export function checkFileSize(file: File, maxMB = MAX_FILE_SIZE_MB): string | null {
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File is too large. Maximum ${maxMB} MB is supported.`;
  }
  return null;
}

export function getFFmpegErrorMessage(err: unknown, formatName: string): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("SharedArrayBuffer") || msg.includes("cross-origin"))
    return "Browser not supported. Please use Chrome or Edge and refresh the page.";
  if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch"))
    return "Check your internet connection. Error while loading FFmpeg.";
  if (msg.includes("Invalid") || msg.includes("format"))
    return `Invalid file format. Please upload a valid ${formatName} file.`;
  return msg || "An error occurred during processing.";
}

export interface ToolPageProps {
  title: string;
  subtitle: string;
  headerLabel: string;
  accept: string;
  validateFile: (file: File) => string | null;
  processFile: (
    file: File,
    ctx: {
      fetchFile: (f: File) => Promise<Uint8Array>;
      writeFile: (path: string, data: Uint8Array) => Promise<boolean>;
      exec: (args: string[]) => Promise<number>;
      readFile: (path: string) => Promise<Uint8Array | string>;
      deleteFile: (path: string) => Promise<boolean>;
    }
  ) => Promise<{ blob: Blob; filename: string }>;
  dropHint: string;
  readyIcon?: ReactNode;
  extraReadyContent?: ReactNode;
}

export function ToolPageLayout({
  title,
  subtitle,
  headerLabel,
  accept,
  validateFile,
  processFile,
  dropHint,
  readyIcon,
  extraReadyContent,
}: ToolPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ConvertState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile) return;
      const sizeErr = checkFileSize(droppedFile);
      if (sizeErr) {
        setError(sizeErr);
        setState("error");
        return;
      }
      const err = validateFile(droppedFile);
      if (err) {
        setError(err);
        setState("error");
        return;
      }
      setFile(droppedFile);
      setState("ready");
      setError(null);
      setOutputBlob(null);
      setProgress(0);
    },
    [validateFile]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;
      const sizeErr = checkFileSize(selectedFile);
      if (sizeErr) {
        setError(sizeErr);
        setState("error");
        return;
      }
      const err = validateFile(selectedFile);
      if (err) {
        setError(err);
        setState("error");
        return;
      }
      setFile(selectedFile);
      setState("ready");
      setError(null);
      setOutputBlob(null);
      setProgress(0);
    },
    [validateFile]
  );

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setState("converting");
    setProgress(0);
    setError(null);
    setIsLoadingFFmpeg(true);

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.9/dist/umd";

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setIsLoadingFFmpeg(false);

      const { fetchFile: fetchFileUtil } = await import("@ffmpeg/util");
      const ctx = {
        fetchFile: (f: File) => fetchFileUtil(f),
        writeFile: (p: string, d: Uint8Array) => ffmpeg.writeFile(p, d),
        exec: (a: string[]) => ffmpeg.exec(a),
        readFile: (p: string) => ffmpeg.readFile(p),
        deleteFile: (p: string) => ffmpeg.deleteFile(p),
      };

      const { blob, filename } = await processFile(file, ctx);
      setOutputBlob(blob);
      setOutputFileName(filename);
      setState("done");
    } catch (err) {
      setIsLoadingFFmpeg(false);
      setError(getFFmpegErrorMessage(err, "desteklenen"));
      setState("error");
    }
  }, [file, processFile]);

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
    setFile(null);
    setState("idle");
    setProgress(0);
    setError(null);
    setOutputBlob(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const dropZoneProps =
    state === "idle" || state === "ready" || state === "error"
      ? { onDragEnter: handleDragEnter, onDragOver: handleDragOver, onDrop: handleDrop }
      : {};

  const defaultIcon = (
    <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );

  const readyIconNode = readyIcon ?? defaultIcon;

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
            <span className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 sm:inline">{headerLabel}</span>
            <NavAuth />
          </div>
        </div>
      </header>

      <main {...dropZoneProps} className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">{subtitle}</p>

          <div
            onClick={() => (state === "idle" || state === "ready" ? inputRef.current?.click() : undefined)}
            className={`relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-all ${
              state === "idle" || state === "ready" || state === "error"
                ? "cursor-pointer border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-600 dark:bg-slate-800/30 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
                : "cursor-default border-slate-200 bg-slate-50/30 dark:border-slate-700 dark:bg-slate-800/20"
            }`}
          >
            <input ref={inputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

            {state === "idle" && (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
                  {defaultIcon}
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{dropHint}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or click to select</p>
              </>
            )}

            {state === "ready" && file && (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
                  {readyIconNode}
                </div>
                <p className="truncate px-4 text-lg font-medium text-slate-900 dark:text-white" title={file.name}>
                  {file.name}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
                {extraReadyContent}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConvert();
                  }}
                  className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Convert
                </button>
              </>
            )}

            {(state === "converting" || isLoadingFFmpeg) && (
              <>
                <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400" />
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {isLoadingFFmpeg ? "Loading FFmpeg..." : "Processing..."}
                </p>
                <div className="mt-6 w-full max-w-xs">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">%{progress}</p>
                </div>
              </>
            )}

            {state === "done" && (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="mt-6 rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Try again
                </button>
              </>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Your files are not uploaded to any server; they are processed on your device.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
