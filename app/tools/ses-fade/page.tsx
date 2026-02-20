"use client";

import { useCallback, useState } from "react";
import { ToolPageLayout, checkFileSize } from "@/app/components/tool-page";

const AUDIO_EXT = [".mp3", ".wav", ".m4a"];

function isAudioFile(file: File): boolean {
  const n = file.name.toLowerCase();
  return AUDIO_EXT.some((e) => n.endsWith(e));
}

export default function SesFadePage() {
  const [fadeIn, setFadeIn] = useState("2");
  const [fadeOut, setFadeOut] = useState("2");

  const validateFile = useCallback((file: File): string | null => {
    if (checkFileSize(file)) return checkFileSize(file)!;
    if (!isAudioFile(file)) return "Please upload an audio file (MP3, WAV, M4A).";
    return null;
  }, []);

  const processFile = useCallback(
    async (file: File, ctx: { fetchFile: (f: File) => Promise<Uint8Array>; writeFile: (p: string, d: Uint8Array) => Promise<boolean>; exec: (a: string[]) => Promise<number>; readFile: (p: string) => Promise<Uint8Array | string>; deleteFile: (p: string) => Promise<boolean> }) => {
      const fi = parseFloat(fadeIn) || 0;
      const fo = parseFloat(fadeOut) || 0;
      const filters: string[] = [];
      if (fi > 0) filters.push(`afade=t=in:st=0:d=${fi}`);
      if (fo > 0) filters.push(`afade=t=out:d=${fo}`);
      const af = filters.length ? filters.join(",") : "anull";
      const ext = file.name.split(".").pop() || "mp3";
      const inp = `input.${ext}`;
      const data = await ctx.fetchFile(file);
      await ctx.writeFile(inp, data);
      if (af === "anull") {
        await ctx.exec(["-i", inp, "-acodec", "libmp3lame", "-qscale:a", "2", "output.mp3"]);
      } else {
        await ctx.exec(["-i", inp, "-af", af, "-acodec", "libmp3lame", "-qscale:a", "2", "output.mp3"]);
      }
      const out = await ctx.readFile("output.mp3");
      const bytes = typeof out === "string" ? new TextEncoder().encode(out) : new Uint8Array(out);
      await ctx.deleteFile(inp);
      await ctx.deleteFile("output.mp3");
      const base = file.name.replace(/\.[^.]+$/, "");
      return { blob: new Blob([bytes], { type: "audio/mpeg" }), filename: `${base}_fade.mp3` };
    },
    [fadeIn, fadeOut]
  );

  return (
    <ToolPageLayout
      title="Ses Fade"
      subtitle="Add fade in/out at the start and end of the audio file."
      headerLabel="Audio Fade"
      accept=".mp3,.wav,.m4a,audio/*"
      validateFile={validateFile}
      processFile={processFile}
      dropHint="Drag your audio file here"
      extraReadyContent={
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Fade in (saniye)</label>
            <input type="number" value={fadeIn} onChange={(e) => setFadeIn(e.target.value)} min={0} step={0.5} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Fade out (saniye)</label>
            <input type="number" value={fadeOut} onChange={(e) => setFadeOut(e.target.value)} min={0} step={0.5} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          </div>
        </div>
      }
    />
  );
}
