"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

function isOggFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return n.endsWith(".ogg") || n.endsWith(".oga");
}

export default function OggToMp3Page() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isOggFile(file)) return "Please upload an OGG file.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const data = await ctx.fetchFile(file);
      const ext = file.name.toLowerCase().endsWith(".oga") ? "oga" : "ogg";
      await ctx.writeFile(`input.${ext}`, data);
      await ctx.exec(["-i", `input.${ext}`, "-c:a", "libmp3lame", "-b:a", "192k", "output.mp3"]);
      const out = await ctx.readFile("output.mp3");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(`input.${ext}`);
      await ctx.deleteFile("output.mp3");
      const base = file.name.replace(/\.(ogg|oga)$/i, "");
      return { blob: new Blob([bytes], { type: "audio/mpeg" }), filename: `${base}.mp3` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="OGG to MP3"
      subtitle="Convert OGG Vorbis audio to MP3 using FFmpeg."
      headerLabel="OGG to MP3"
      accept=".ogg,.oga,audio/ogg"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your OGG file here"
    />
  );
}
