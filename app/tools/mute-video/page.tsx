"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/x-msvideo", "video/quicktime", "video/x-matroska"];

function isVideoFile(file: File): boolean {
  const n = file.name.toLowerCase();
  const t = file.type.toLowerCase();
  return VIDEO_EXT.some((e) => n.endsWith(e)) || VIDEO_TYPES.includes(t);
}

export default function MuteVideoPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isVideoFile(file)) return "Please upload a video file (MP4, WebM, AVI, MOV, MKV).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "mp4";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "-an", "-c:v", "copy", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}_muted.mp4` };
    },
    []
  );

  return (
    <ToolPageLayout
title="Mute Video"
  subtitle="Remove the audio track from the video to create a silent video."
      headerLabel="Mute Video"
      accept=".mp4,.webm,.avi,.mov,.mkv,video/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your video file here"
    />
  );
}
