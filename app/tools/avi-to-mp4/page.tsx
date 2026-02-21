"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isAviFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".avi");
}

export default function AviToMp4Page() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isAviFile(file)) return "Please upload an AVI file.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      await ctx.writeFile("input.avi", data);
      await ctx.exec(["-i", "input.avi", "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-c:a", "aac", "-b:a", "128k", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile("input.avi");
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.avi$/i, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}.mp4` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="AVI to MP4"
      subtitle="Convert AVI video to MP4 using FFmpeg. Keeps good quality."
      headerLabel="AVI to MP4"
      accept=".avi,video/x-msvideo"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your AVI file here"
    />
  );
}
