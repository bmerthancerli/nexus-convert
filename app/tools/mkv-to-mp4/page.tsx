"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isMkvFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".mkv");
}

export default function MkvToMp4Page() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isMkvFile(file)) return "Please upload an MKV file.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      await ctx.writeFile("input.mkv", data);
      await ctx.exec(["-i", "input.mkv", "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-c:a", "aac", "-b:a", "128k", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile("input.mkv");
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.mkv$/i, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}.mp4` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="MKV to MP4"
      subtitle="Convert MKV video to MP4 using FFmpeg. Widely compatible."
      headerLabel="MKV to MP4"
      accept=".mkv,video/x-matroska"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your MKV file here"
    />
  );
}
