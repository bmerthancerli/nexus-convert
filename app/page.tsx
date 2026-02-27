import Link from "next/link";
import { Footer } from "@/app/components/footer";
import { NavAuth } from "@/app/components/nav-auth";
import {
  Music,
  Headphones,
  Image as ImageIcon,
  Film,
  Scissors,
  Volume2,
  VideoOff,
  Maximize2,
  FileAudio,
  Gauge,
  Layers,
  Package,
  RefreshCw,
  ChevronRight,
  Sparkles,
  RotateCw,
  Camera,
  Merge,
} from "lucide-react";

const iconMap = {
  Sparkles,
  Music,
  Headphones,
  ImageIcon,
  Film,
  Scissors,
  Volume2,
  VideoOff,
  Maximize2,
  FileAudio,
  Gauge,
  Layers,
  Package,
  RefreshCw,
  RotateCw,
  Camera,
  Merge,
} as const;

const categories = [
  {
    id: "popular",
    title: "Popular Tools",
    tools: [
      { name: "Background Remover (AI)", path: "/tools/remove-background", desc: "Remove image background with AI", icon: "Sparkles", color: "from-indigo-500 to-blue-500" },
      { name: "WAV to MP3", path: "/tools/wav-to-mp3", desc: "Convert audio files to MP3", icon: "Music", color: "from-emerald-500 to-teal-500" },
      { name: "MP4 to MP3", path: "/tools/mp4-to-mp3", desc: "Extract MP3 audio from video", icon: "Headphones", color: "from-cyan-500 to-teal-500" },
      { name: "Video to GIF", path: "/tools/video-to-gif", desc: "Create GIFs from video clips", icon: "Film", color: "from-rose-500 to-pink-500" },
      { name: "Video Speed Up", path: "/tools/video-speed", desc: "Play video at 2x speed", icon: "Gauge", color: "from-amber-500 to-orange-500" },
      { name: "Video Compress", path: "/tools/video-sikistir", desc: "Reduce video file size", icon: "Package", color: "from-sky-500 to-blue-500" },
      { name: "MP4 to WebM", path: "/tools/mp4-to-webm", desc: "Convert MP4 video to WebM", icon: "Film", color: "from-violet-500 to-purple-500" },
      { name: "WebM to MP4", path: "/tools/webm-to-mp4", desc: "Convert WebM video to MP4", icon: "Film", color: "from-fuchsia-500 to-pink-500" },
    ],
  },
  {
    id: "audio",
    title: "Audio Tools",
    tools: [
      { name: "WAV to MP3", path: "/tools/wav-to-mp3", desc: "Convert WAV files to MP3", icon: "Music", color: "from-emerald-500 to-teal-500" },
      { name: "MP4 to MP3", path: "/tools/mp4-to-mp3", desc: "Extract MP3 audio from video", icon: "Headphones", color: "from-cyan-500 to-teal-500" },
      { name: "MP3 Trimmer", path: "/tools/mp3-trimmer", desc: "Trim and shorten MP3 files", icon: "Scissors", color: "from-indigo-500 to-slate-600" },
      { name: "Volume Booster", path: "/tools/volume-booster", desc: "Increase audio volume", icon: "Volume2", color: "from-sky-500 to-blue-500" },
      { name: "Audio Joiner", path: "/tools/audio-joiner", desc: "Merge multiple audio files", icon: "Layers", color: "from-teal-500 to-cyan-500" },
      { name: "Audio Converter", path: "/tools/audio-converter", desc: "Convert between audio formats", icon: "FileAudio", color: "from-emerald-500 to-teal-500" },
      { name: "MP3 to WAV", path: "/tools/mp3-to-wav", desc: "Convert MP3 files to WAV", icon: "Music", color: "from-teal-500 to-cyan-500" },
      { name: "Audio Compress", path: "/tools/ses-sikistir", desc: "Reduce audio file size", icon: "Package", color: "from-sky-500 to-blue-500" },
      { name: "Audio Fade", path: "/tools/ses-fade", desc: "Fade in/out at start and end", icon: "Volume2", color: "from-indigo-500 to-violet-500" },
    ],
  },
  {
    id: "video",
    title: "Video Tools",
    tools: [
      { name: "Video to GIF", path: "/tools/video-to-gif", desc: "Create GIF animation from video", icon: "Film", color: "from-rose-500 to-pink-500" },
      { name: "MP4 to MP3", path: "/tools/mp4-to-mp3", desc: "Extract MP3 audio from video", icon: "Headphones", color: "from-cyan-500 to-teal-500" },
      { name: "Video Trimmer", path: "/tools/video-trimmer", desc: "Trim and shorten video", icon: "Scissors", color: "from-indigo-500 to-blue-500" },
      { name: "Video Resizer", path: "/tools/video-resizer", desc: "Change video resolution", icon: "Maximize2", color: "from-indigo-500 to-blue-500" },
      { name: "Video to WebP", path: "/tools/video-to-webp", desc: "Extract WebP frame from video", icon: "ImageIcon", color: "from-amber-500 to-orange-500" },
      { name: "Mute Video", path: "/tools/mute-video", desc: "Create silent video", icon: "VideoOff", color: "from-slate-500 to-slate-600" },
      { name: "Video Speed Up", path: "/tools/video-speed", desc: "Speed up video", icon: "Gauge", color: "from-amber-500 to-orange-500" },
      { name: "Video Compress", path: "/tools/video-sikistir", desc: "Reduce video size", icon: "Package", color: "from-sky-500 to-blue-500" },
      { name: "MP4 to WebM", path: "/tools/mp4-to-webm", desc: "Convert MP4 to WebM", icon: "Film", color: "from-violet-500 to-purple-500" },
      { name: "Video Joiner", path: "/tools/video-birlestirici", desc: "Merge multiple videos", icon: "Merge", color: "from-indigo-500 to-blue-500" },
      { name: "Extract Frame", path: "/tools/videodan-kare-cikar", desc: "Extract PNG frame from video", icon: "Camera", color: "from-rose-500 to-pink-500" },
      { name: "Images to Video", path: "/tools/gorsellerden-video", desc: "Create slideshow video from images", icon: "ImageIcon", color: "from-amber-500 to-orange-500" },
      { name: "Video Slow Down", path: "/tools/video-yavaslat", desc: "Play video at 0.5x speed", icon: "Gauge", color: "from-teal-500 to-cyan-500" },
      { name: "Rotate Video", path: "/tools/video-dondur", desc: "Rotate video 90°", icon: "RotateCw", color: "from-slate-500 to-slate-600" },
      { name: "Reverse Video", path: "/tools/video-ters-oynat", desc: "Play video in reverse", icon: "RefreshCw", color: "from-cyan-500 to-teal-500" },
      { name: "Video Crop", path: "/tools/video-kirp", desc: "Crop region from video", icon: "Maximize2", color: "from-emerald-500 to-teal-500" },
      { name: "Video Time Trim", path: "/tools/video-zaman-kesici", desc: "Trim by start and end time", icon: "Scissors", color: "from-rose-500 to-pink-500" },
      { name: "Video Watermark", path: "/tools/videoya-filigran", desc: "Add logo/watermark to video", icon: "ImageIcon", color: "from-slate-500 to-slate-600" },
      { name: "Video Mirror", path: "/tools/video-ayna", desc: "Horizontal or vertical mirror effect", icon: "RefreshCw", color: "from-violet-500 to-purple-500" },
      { name: "Add Audio to Video", path: "/tools/videoya-ses-ekle", desc: "Add audio track to silent video", icon: "Headphones", color: "from-cyan-500 to-blue-500" },
    ],
  },
  {
    id: "ffmpeg",
    title: "FFmpeg Tools",
    tools: [
      { name: "AVI to MP4", path: "/tools/avi-to-mp4", desc: "Convert AVI video to MP4 with FFmpeg", icon: "Film", color: "from-blue-500 to-indigo-500" },
      { name: "MKV to MP4", path: "/tools/mkv-to-mp4", desc: "Convert MKV video to MP4 format", icon: "Film", color: "from-rose-500 to-red-500" },
      { name: "FLAC to MP3", path: "/tools/flac-to-mp3", desc: "Convert lossless FLAC audio to MP3", icon: "Music", color: "from-amber-500 to-orange-500" },
      { name: "OGG to MP3", path: "/tools/ogg-to-mp3", desc: "Convert OGG Vorbis audio to MP3", icon: "Headphones", color: "from-emerald-500 to-teal-500" },
      { name: "MOV to MP4", path: "/tools/mov-to-mp4", desc: "Convert QuickTime MOV to MP4", icon: "Film", color: "from-violet-500 to-purple-500" },
      { name: "WebM to MP4", path: "/tools/webm-to-mp4", desc: "Convert WebM to MP4 format", icon: "Film", color: "from-fuchsia-500 to-pink-500" },
    ],
  },
  {
    id: "image",
    title: "Image Tools",
    tools: [
      { name: "JPG to PNG", path: "/tools/jpg-to-png", desc: "Convert JPG images to PNG", icon: "ImageIcon", color: "from-amber-500 to-orange-500" },
      { name: "Image Compress", path: "/tools/resim-sikistir", desc: "Reduce image size", icon: "Package", color: "from-lime-500 to-green-500" },
      { name: "SVG Converter", path: "/tools/svg-donusturucu", desc: "Convert to SVG format", icon: "RefreshCw", color: "from-teal-500 to-cyan-500" },
      { name: "Images to Video", path: "/tools/gorsellerden-video", desc: "Create slideshow video from images", icon: "Film", color: "from-amber-500 to-orange-500" },
      { name: "Image Format Converter", path: "/tools/gorsel-format-donusturucu", desc: "Convert to PNG, JPG, WebP", icon: "RefreshCw", color: "from-teal-500 to-cyan-500" },
      { name: "Image Resizer", path: "/tools/gorsel-boyutlandir", desc: "Resize image", icon: "Maximize2", color: "from-lime-500 to-green-500" },
      { name: "Images to GIF", path: "/tools/gorsellerden-gif", desc: "Create animated GIF from images", icon: "Film", color: "from-rose-500 to-pink-500" },
    ],
  },
];

export default function ToolsDashboard() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(15 23 42) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(15 23 42) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 hidden opacity-[0.06] dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      {/* Navbar */}
      <nav className="relative border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">
              NexusConvert
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/hakkinda" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
                About
              </Link>
              <Link href="/iletisim" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <NavAuth />
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
            NexusConvert
          </h1>
          <p className="mt-3 text-xl text-slate-600 dark:text-slate-400 sm:text-2xl">
            All your file tools in one place
          </p>

          {/* Popular searches */}
          <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Popular searches:</span>
            {[
              { term: "Resize Image", href: "/tools/resim-sikistir" },
              { term: "PDF to Word", href: "#" },
              { term: "WAV to MP3", href: "/tools/wav-to-mp3" },
              { term: "MP4 to MP3", href: "/tools/mp4-to-mp3" },
            ].map(({ term, href }) => (
              <Link
                key={term}
                href={href}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                {term}
              </Link>
            ))}
          </div>

          {/* Search bar with button */}
          <div className="mx-auto mt-5 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0111 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search tools... (e.g. MP3, PNG, GIF)"
                className="block w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-8 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <main className="relative px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          {categories.map((category) => (
            <section key={category.id}>
              <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
                {category.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => (
                  <Link
                    key={`${category.id}-${tool.name}`}
                    href={tool.path}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} shadow-sm`}
                    >
                      {(() => {
                        const Icon = iconMap[tool.icon as keyof typeof iconMap] ?? Music;
                        return <Icon className="h-6 w-6 text-white" strokeWidth={2} />;
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tool.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {tool.desc}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
