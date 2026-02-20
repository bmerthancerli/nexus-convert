"use client";

import { useCallback } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".bmp"];

function isImageFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return IMAGE_EXT.some((e) => n.endsWith(e));
}

export default function SvgDonusturucuPage() {
  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file, 50)) return checkFileSize(file, 50)!;
    if (!isImageFile(file)) return "Please upload a raster image (JPG, PNG, WebP, BMP).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "png";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "output.png"]);
      const out = await ctx.readFile("output.png");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.png");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "image/png" }), filename: `${base}.png` };
    },
    []
  );

  return (
    <ToolPageLayout
title="Image Converter"
  subtitle="Convert images to PNG format."
  headerLabel="SVG Converter"
      accept=".jpg,.jpeg,.png,.webp,.bmp,image/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your image here"
    />
  );
}
