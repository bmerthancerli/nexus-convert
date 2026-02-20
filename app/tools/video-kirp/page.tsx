"use client";

import { useCallback, useState } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];

function isVideoFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return VIDEO_EXT.some((e) => n.endsWith(e));
}

export default function VideoKirpPage() {
  const [width, setWidth] = useState("640");
  const [height, setHeight] = useState("360");
  const [x, setX] = useState("0");
  const [y, setY] = useState("0");

  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isVideoFile(file)) return "Please upload a video file.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const w = parseInt(width, 10) || 640;
      const h = parseInt(height, 10) || 360;
      const xVal = parseInt(x, 10) || 0;
      const yVal = parseInt(y, 10) || 0;
      const ext = file.name.split(".").pop() || "mp4";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "-vf", `crop=${w}:${h}:${xVal}:${yVal}`, "-c:a", "copy", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}_cropped.mp4` };
    },
    [width, height, x, y]
  );

  return (
    <ToolPageLayout
title="Video Crop"
  subtitle="Crop a region from the video. Enter width, height and start position."
  headerLabel="Video Crop"
  accept=".mp4,.webm,.avi,.mov,.mkv,video/*"
  validateFile={validateFile}
  processFile={processFile}
  dropHint="Drag your video file here"
      extraReadyContent={
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Width (px)</label>
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} min={1} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Height (px)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} min={1} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">X (start)</label>
            <input type="number" value={x} onChange={(e) => setX(e.target.value)} min={0} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Y (start)</label>
            <input type="number" value={y} onChange={(e) => setY(e.target.value)} min={0} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
      }
    />
  );
}
