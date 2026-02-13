import Link from "next/link";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "İletişim | NexusConvert",
  description: "NexusConvert iletişim. Sorularınız ve geri bildirimleriniz için bize ulaşın.",
};

export default function IletisimPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="relative border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-white">
            NexusConvert
          </Link>
          <nav className="flex gap-4">
            <Link href="/hakkinda" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Hakkımızda
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">İletişim</h1>

          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Bize Ulaşın</h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                Sorularınız, önerileriniz, teknik destek talepleriniz veya iş birliği önerileriniz için aşağıdaki e-posta adresinden bize ulaşabilirsiniz.
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <span className="block text-sm font-medium text-slate-500 dark:text-slate-400">E-posta</span>
                  <a
                    href="mailto:info@nexusconvert.com"
                    className="text-lg font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    info@nexusconvert.com
                  </a>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Yanıt süresi genellikle 1-3 iş günüdür.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Sık Sorulan Konular</h2>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li>
                  <strong className="text-slate-700 dark:text-slate-300">Dosyalarım güvende mi?</strong>
                  <br />
                  Çoğu araçta dosyalar cihazınızda işlenir, sunucularımıza yüklenmez. Arka Plan Silici aracı istisnadır.
                </li>
                <li>
                  <strong className="text-slate-700 dark:text-slate-300">Hizmet ücretsiz mi?</strong>
                  <br />
                  Evet, tüm araçlar ücretsizdir. Reklamlar ile desteklenmektedir.
                </li>
                <li>
                  <strong className="text-slate-700 dark:text-slate-300">Maksimum dosya boyutu?</strong>
                  <br />
                  Araçlara göre değişir; genellikle 50-100 MB aralığındadır.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
