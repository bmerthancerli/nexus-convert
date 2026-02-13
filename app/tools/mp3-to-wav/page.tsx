"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isMp3File(file: File): boolean {
  const n = file.name.toLowerCase();
  const t = file.type.toLowerCase();
  return n.endsWith(".mp3") || t === "audio/mpeg";
}

export default function Mp3ToWavPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isMp3File(file)) return "Lütfen MP3 dosyası yükleyin.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      await ctx.writeFile("input.mp3", data);
      await ctx.exec(["-i", "input.mp3", "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", "output.wav"]);
      const out = await ctx.readFile("output.wav");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile("input.mp3");
      await ctx.deleteFile("output.wav");
      const base = file.name.replace(/\.mp3$/i, "");
      return { blob: new Blob([bytes], { type: "audio/wav" }), filename: `${base}.wav` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="MP3 to WAV"
      subtitle="MP3 dosyalarını WAV formatına dönüştürün."
      headerLabel="MP3 to WAV"
      accept=".mp3,audio/mpeg"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="MP3 dosyanızı buraya sürükleyin"
    />
  );
}
