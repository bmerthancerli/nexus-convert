"use client";

import { useCallback, useState } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];

function isVideoFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return VIDEO_EXT.some((e) => n.endsWith(e));
}

export default function VideoZamanKesiciPage() {
  const [startTime, setStartTime] = useState("0");
  const [endTime, setEndTime] = useState("60");

  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isVideoFile(file)) return "Please upload a video file.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const start = parseFloat(startTime) || 0;
      const end = parseFloat(endTime) || 60;
      const duration = Math.max(0.1, end - start);
      const ext = file.name.split(".").pop() || "mp4";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-ss", String(start), "-i", inp, "-t", String(duration), "-c", "copy", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}_trimmed.mp4` };
    },
    [startTime, endTime]
  );

  return (
    <ToolPageLayout
title="Video Time Trim"
  subtitle="Trim video by start and end time. E.g. 0 to 60 = first 60 seconds."
      headerLabel="Video Trim"
      accept=".mp4,.webm,.avi,.mov,.mkv,video/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your video file here"
      extraReadyContent={
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Start (seconds)</label>
            <input type="number" value={startTime} onChange={(e) => setStartTime(e.target.value)} min={0} step={0.1} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">End (seconds)</label>
            <input type="number" value={endTime} onChange={(e) => setEndTime(e.target.value)} min={0} step={0.1} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
      }
    />
  );
}
