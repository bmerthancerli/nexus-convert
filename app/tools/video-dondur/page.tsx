"use client";

import { useCallback, useState } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const VIDEO_EXT = [".mp4", ".webm", ".avi", ".mov", ".mkv"];

function isVideoFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return VIDEO_EXT.some((e) => n.endsWith(e));
}

const ROTATIONS = [
  { value: "90", label: "90° saat yönü", vf: "transpose=1" },
  { value: "180", label: "180°", vf: "transpose=2,transpose=2" },
  { value: "270", label: "270° saat yönü", vf: "transpose=2" },
] as const;

export default function VideoDondurPage() {
  const [rotation, setRotation] = useState<"90" | "180" | "270">("90");

  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isVideoFile(file)) return "Lütfen video dosyası yükleyin (MP4, WebM, AVI, MOV, MKV).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const ext = file.name.split(".").pop() || "mp4";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      const r = ROTATIONS.find((x) => x.value === rotation)!;
      await ctx.exec(["-i", inp, "-vf", r.vf, "-c:a", "copy", "output.mp4"]);
      const out = await ctx.readFile("output.mp4");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.mp4");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "video/mp4" }), filename: `${base}_rotated_${rotation}.mp4` };
    },
    [rotation]
  );

  return (
    <ToolPageLayout
      title="Video Döndür"
      subtitle="Videoyu 90°, 180° veya 270° döndürün."
      headerLabel="Video Rotate"
      accept=".mp4,.webm,.avi,.mov,.mkv,video/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Video dosyanızı buraya sürükleyin"
      extraReadyContent={
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Dönüş açısı</label>
          <select
            value={rotation}
            onChange={(e) => setRotation(e.target.value as "90" | "180" | "270")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            {ROTATIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
}
