"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function isImageFile(file: File): boolean {
  const n = file.name.toLowerCase();
  const t = file.type.toLowerCase();
  return IMAGE_EXT.some((e) => n.endsWith(e)) || ["image/jpeg", "image/png", "image/webp"].includes(t);
}

export default function ResimSikistirPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file, 50)) return checkFileSize(file, 50)!;
    if (!isImageFile(file)) return "Please upload an image file (JPG, PNG, WebP).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "jpg";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "-q:v", "5", "output.jpg"]);
      const out = await ctx.readFile("output.jpg");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.jpg");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "image/jpeg" }), filename: `${base}_compressed.jpg` };
    },
    []
  );

  return (
    <ToolPageLayout
title="Image Compress"
  subtitle="Reduce image size, compress files."
  headerLabel="Image Compress"
      accept=".jpg,.jpeg,.png,.webp,image/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your image here"
    />
  );
}
