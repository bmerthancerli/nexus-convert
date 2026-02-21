"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isFlacFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".flac");
}

export default function FlacToMp3Page() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isFlacFile(file)) return "Please upload a FLAC file.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      await ctx.writeFile("input.flac", data);
      await ctx.exec(["-i", "input.flac", "-c:a", "libmp3lame", "-b:a", "192k", "output.mp3"]);
      const out = await ctx.readFile("output.mp3");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile("input.flac");
      await ctx.deleteFile("output.mp3");
      const base = file.name.replace(/\.flac$/i, "");
      return { blob: new Blob([bytes], { type: "audio/mpeg" }), filename: `${base}.mp3` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="FLAC to MP3"
      subtitle="Convert lossless FLAC audio to MP3 using FFmpeg. 192 kbps."
      headerLabel="FLAC to MP3"
      accept=".flac,audio/flac"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your FLAC file here"
    />
  );
}
