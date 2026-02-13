import Link from "next/link";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "Hakkımızda | NexusConvert",
  description: "NexusConvert hakkında. Dosya dönüştürme araçları, gizlilik ve misyonumuz.",
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
              İletişim
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Hakkımızda</h1>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">NexusConvert Nedir?</h2>
              <p>
                NexusConvert, ses, video ve görsel dosyalarınızı dönüştürmenize yardımcı olan ücretsiz bir çevrimiçi araç platformudur. WAV&apos;dan MP3&apos;e, MP4&apos;ten GIF&apos;e, JPG&apos;den PNG&apos;ye kadar birçok format dönüşümünü tek bir yerden gerçekleştirebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Misyonumuz</h2>
              <p>
                Kullanıcılarımıza hızlı, kolay ve güvenli dosya dönüştürme deneyimi sunmak. Araçlarımızın büyük çoğunluğu tarayıcıda çalışır; bu sayede dosyalarınız cihazınızda işlenir ve gizliliğiniz korunur.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Özellikler</h2>
              <ul className="list-inside list-disc space-y-2">
                <li>40+ dosya dönüştürme ve düzenleme aracı</li>
                <li>Ses, video ve görsel formatları için kapsamlı destek</li>
                <li>Çoğu araçta %100 client-side işleme (dosyalar sunucuya yüklenmez)</li>
                <li>Yapay zeka destekli arka plan silici</li>
                <li>Ücretsiz ve reklam destekli kullanım</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">Teknoloji</h2>
              <p>
                NexusConvert, FFmpeg tabanlı tarayıcı teknolojisi (ffmpeg.wasm) kullanarak dosya işlemlerini doğrudan cihazınızda gerçekleştirir. Arka Plan Silici aracı ise sunucu tarafında yapay zeka modelleri ile çalışır.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">İletişim</h2>
              <p>
                Sorularınız, önerileriniz veya geri bildirimleriniz için{" "}
                <Link href="/iletisim" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  İletişim
                </Link>{" "}
                sayfamızdan bize ulaşabilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
