"use client";

import { useCallback, useState } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".bmp"];

function isImageFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return IMAGE_EXT.some((e) => n.endsWith(e));
}

export default function GorselBoyutlandirPage() {
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("");

  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file, 50)) return checkFileSize(file, 50)!;
    if (!isImageFile(file)) return "Lütfen görsel dosyası yükleyin.";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const w = parseInt(width, 10) || 800;
      const h = height ? parseInt(height, 10) : -2;
      const scale = h > 0 ? `${w}:${h}` : `${w}:-2`;
      const ext = file.name.split(".").pop() || "png";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      await ctx.exec(["-i", inp, "-vf", `scale=${scale}`, "output.png"]);
      const out = await ctx.readFile("output.png");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.png");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "image/png" }), filename: `${base}_${w}px.png` };
    },
    [width, height]
  );

  return (
    <ToolPageLayout
      title="Görsel Boyutlandır"
      subtitle="Görseli yeniden boyutlandırın. Genişlik zorunlu, yükseklik boş bırakılırsa orantı korunur."
      headerLabel="Image Resize"
      accept=".jpg,.jpeg,.png,.webp,.bmp,image/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Görsel dosyanızı buraya sürükleyin"
      extraReadyContent={
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Genişlik (px)</label>
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} min={1} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Yükseklik (px, opsiyonel)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} min={0} placeholder="Boş = orantılı" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
      }
    />
  );
}
