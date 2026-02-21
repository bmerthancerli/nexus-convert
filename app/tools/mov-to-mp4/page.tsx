"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isMovFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".mov") || n.endsWith(".qt");
}

export default function MovToMp4Page() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isMovFile(file)) return "Please upload a MOV (QuickTime) file.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      const ext = file.name.toLowerCase().endsWith(".qt") ? "qt" : "mov";
      await ctx.writeFile(`input.${ext}`, data);
      await ctx.exec(["-i", `input.${ext}`, "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-c:a", "aac", "-b:a", "128k", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(`input.${ext}`);
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.(mov|qt)$/i, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}.mp4` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="MOV to MP4"
      subtitle="Convert QuickTime MOV to MP4 using FFmpeg. Web-friendly."
      headerLabel="MOV to MP4"
      accept=".mov,.qt,video/quicktime"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your MOV file here"
    />
  );
}
