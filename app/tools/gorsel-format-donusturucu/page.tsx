"use client";

import { useCallback, useState } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".bmp"];

function isImageFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return IMAGE_EXT.some((e) => n.endsWith(e));
}

const OUTPUT_FORMATS = [
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "jpg", label: "JPG", mime: "image/jpeg" },
  { value: "webp", label: "WebP", mime: "image/webp" },
] as const;

export default function GorselFormatDonusturucuPage() {
  const [format, setFormat] = useState<"png" | "jpg" | "webp">("png");

  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file, 50)) return checkFileSize(file, 50)!;
    if (!isImageFile(file)) return "Please upload an image file (JPG, PNG, WebP, BMP).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "png";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      const outExt = format;
      const mime = OUTPUT_FORMATS.find((f) => f.value === format)?.mime || "image/png";
      if (format === "jpg") {
        await ctx.exec(["-i", inp, "-q:v", "2", "output.jpg"]);
      } else if (format === "webp") {
        await ctx.exec(["-i", inp, "-q:v", "80", "output.webp"]);
      } else {
        await ctx.exec(["-i", inp, "output.png"]);
      }
      const out = await ctx.readFile(`output.${outExt}`);
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile(`output.${outExt}`);
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: mime }), filename: `${base}.${outExt}` };
    },
    [format]
  );

  return (
    <ToolPageLayout
title="Image Format Converter"
  subtitle="Convert images to PNG, JPG or WebP format."
      headerLabel="Image Format"
      accept=".jpg,.jpeg,.png,.webp,.bmp,image/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your image here"
      extraReadyContent={
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Output format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            {OUTPUT_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      }
    />
  );
}
