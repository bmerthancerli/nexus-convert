"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];

function isVideoFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return VIDEO_EXT.some((e) => n.endsWith(e));
}

export default function VideoTersOynatPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isVideoFile(file)) return "Lütfen video dosyası yükleyin (MP4, WebM, AVI, MOV, MKV).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "mp4";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "-vf", "reverse", "-af", "areverse", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}_reversed.mp4` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="Video Ters Oynat"
      subtitle="Videoyu tersten oynatın."
      headerLabel="Video Reverse"
      accept=".mp4,.webm,.avi,.mov,.mkv,video/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Video dosyanızı buraya sürükleyin"
    />
  );
}
