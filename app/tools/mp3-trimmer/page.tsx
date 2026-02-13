"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isMp3File(file: File): boolean {
  const n = file.name.toLowerCase();
  const t = file.type.toLowerCase();
  return n.endsWith(".mp3") || t === "audio/mpeg";
}

export default function Mp3TrimmerPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isMp3File(file)) return "Lütfen sadece MP3 dosyası yükleyin.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      await ctx.writeFile("input.mp3", data);
      await ctx.exec(["-i", "input.mp3", "-ss", "0", "-t", "60", "-c", "copy", "output.mp3"]);
      const out = await ctx.readFile("output.mp3");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile("input.mp3");
      await ctx.deleteFile("output.mp3");
      const base = file.name.replace(/\.mp3$/i, "");
      return { blob: new Blob([bytes], { type: "audio/mpeg" }), filename: `${base}_trimmed.mp3` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="MP3 Kesici (Trimmer)"
      subtitle="MP3 dosyanızın ilk 60 saniyesini çıkarın."
      headerLabel="MP3 Trimmer"
      accept=".mp3,audio/mpeg"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="MP3 dosyanızı buraya sürükleyin"
    />
  );
}
