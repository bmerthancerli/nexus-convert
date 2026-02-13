"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];

function isVideoFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return VIDEO_EXT.some((e) => n.endsWith(e));
}

export default function VideoToGifPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file, 50)) return checkFileSize(file, 50)!;
    if (!isVideoFile(file)) return "Lütfen video dosyası yükleyin (MP4, WebM, AVI, MOV, MKV).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "mp4";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "-vf", "fps=10,scale=320:-1:flags=lanczos", "-c:v", "gif", "output.gif"]);
      const out = await ctx.readFile("output.gif");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.gif");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "image/gif" }), filename: `${base}.gif` };
    },
    []
  );

  return (
    <ToolPageLayout
      title="Video to GIF"
      subtitle="Videodan GIF animasyonu oluşturun."
      headerLabel="Video to GIF"
      accept=".mp4,.webm,.avi,.mov,.mkv,video/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Video dosyanızı buraya sürükleyin"
    />
  );
}
