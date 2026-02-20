"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const AUDIO_EXT = [".mp3", ".wav", ".m4a", ".ogg", ".flac"];

function isAudioFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return AUDIO_EXT.some((e) => n.endsWith(e));
}

export default function AudioConverterPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isAudioFile(file)) return "Please upload an audio file (MP3, WAV, M4A, OGG, FLAC).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "mp3";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "-acodec", "libmp3lame", "-qscale:a", "2", "output.mp3"]);
      const out = await ctx.readFile("output.mp3");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.mp3");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "audio/mpeg" }), filename: `${base}.mp3` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="Audio Converter"
      subtitle="Convert audio files to MP3 format."
      headerLabel="Audio Converter"
      accept=".mp3,.wav,.m4a,.ogg,.flac,audio/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your audio file here"
    />
  );
}
