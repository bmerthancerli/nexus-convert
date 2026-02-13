"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isMp4File(file: File): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".mp4") || n.endsWith(".m4v");
}

export default function Mp4ToWebmPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isMp4File(file)) return "Lütfen MP4 dosyası yükleyin.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      await ctx.writeFile("input.mp4", data);
      await ctx.exec(["-i", "input.mp4", "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus", "-b:a", "128k", "output.webm"]);
      const out = await ctx.readFile("output.webm");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile("input.mp4");
      await ctx.deleteFile("output.webm");
      const base = file.name.replace(/\.(mp4|m4v)$/i, "");
      return { blob: new Blob([bytes], { type: "video/webm" }), filename: `${base}.webm` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="MP4 to WebM"
      subtitle="MP4 videoyu WebM formatına dönüştürün. Web için optimize."
      headerLabel="MP4 to WebM"
      accept=".mp4,.m4v,video/mp4"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="MP4 dosyanızı buraya sürükleyin"
    />
  );
}
