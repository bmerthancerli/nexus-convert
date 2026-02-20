import Link from "next/link";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "About | NexusConvert",
  description: "About NexusConvert. File conversion tools, privacy and our mission.",
};

export default function HakkindaPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="relative border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">
            NexusConvert
          </Link>
          <nav className="flex gap-4">
            <Link href="/iletisim" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">About</h1>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">What is NexusConvert?</h2>
              <p>
                NexusConvert is a free online tool platform that helps you convert your audio, video and image files. You can perform many format conversions in one place, from WAV to MP3, MP4 to GIF, JPG to PNG and more.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Our Mission</h2>
              <p>
                To provide our users with a fast, easy and secure file conversion experience. Most of our tools run in the browser, so your files are processed on your device and your privacy is protected.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Features</h2>
              <ul className="list-inside list-disc space-y-2">
                <li>40+ file conversion and editing tools</li>
                <li>Comprehensive support for audio, video and image formats</li>
                <li>100% client-side processing for most tools (files are not uploaded to the server)</li>
                <li>AI-powered background remover</li>
                <li>Free, ad-supported use</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Technology</h2>
              <p>
                NexusConvert uses FFmpeg-based browser technology (ffmpeg.wasm) to process files directly on your device. The Background Remover tool runs on the server using AI models.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Contact</h2>
              <p>
                For questions, suggestions or feedback, reach us via our{" "}
                <Link href="/iletisim" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  Contact
                </Link>{" "}
                page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
