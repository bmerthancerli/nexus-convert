import Link from "next/link";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "Gizlilik Politikası | NexusConvert",
  description: "NexusConvert gizlilik politikası. Çerezler, veri toplama ve kullanıcı gizliliği hakkında bilgiler.",
};

export default function GizlilikPolitikasiPage() {
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
            <Link href="/iletisim" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              İletişim
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Gizlilik Politikası</h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Son güncelleme: Şubat 2025</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">1. Giriş</h2>
              <p>
                NexusConvert (&quot;biz&quot;, &quot;bizim&quot; veya &quot;site&quot;) olarak kullanıcı gizliliğinize önem veriyoruz. Bu Gizlilik Politikası, sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda toplanan bilgilerin nasıl işlendiğini açıklamaktadır.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">2. Toplanan Bilgiler</h2>
              <p>
                NexusConvert büyük ölçüde tarayıcı tabanlı (client-side) dosya dönüştürme araçları sunar. Yüklediğiniz dosyalar, çoğu araçta doğrudan cihazınızda işlenir ve sunucularımıza aktarılmaz. Bunun istisnası Arka Plan Silici (AI) aracıdır; bu araçta gönderdiğiniz görsel, arka plan kaldırma işlemi için geçici olarak sunucumuzda işlenir.
              </p>
              <p className="mt-3">
                Otomatik olarak toplanan bilgiler: IP adresi, tarayıcı türü, işletim sistemi, ziyaret edilen sayfalar, ziyaret süresi ve benzeri teknik veriler.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">3. Çerezler (Cookies)</h2>
              <p>
                Sitemiz, deneyiminizi iyileştirmek ve hizmetlerimizi analiz etmek amacıyla çerezler kullanabilir. Kullandığımız çerez türleri:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><strong>Zorunlu çerezler:</strong> Sitenin temel işlevlerini sağlamak için gereklidir.</li>
                <li><strong>Analitik çerezler:</strong> Ziyaretçi sayısı ve sayfa kullanımını anlamak için (Google Analytics gibi).</li>
                <li><strong>Reklam çerezleri:</strong> Google AdSense veya benzeri reklam ağları, size ilgili reklamlar göstermek için çerez kullanabilir.</li>
              </ul>
              <p className="mt-3">
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda sitenin bazı özellikleri düzgün çalışmayabilir.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">4. Google AdSense ve Reklamlar</h2>
              <p>
                Sitemizde Google AdSense reklamları yayınlanabilir. Google, kullanıcılarına daha uygun reklamlar sunmak için çerezler ve benzeri teknolojiler kullanır. Google&apos;un reklam ve gizlilik politikaları hakkında daha fazla bilgi için{" "}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  Google Reklam Politikası
                </a>{" "}
                ve{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  Google Gizlilik Politikası
                </a>{" "}
                sayfalarını inceleyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">5. Verilerin Korunması</h2>
              <p>
                Topladığımız verileri yetkisiz erişime, kayba veya değişikliğe karşı korumak için makul güvenlik önlemleri uyguluyoruz. Dosya dönüştürme işlemlerinin büyük çoğunluğu cihazınızda gerçekleştiği için, yüklediğiniz dosyalar sunucularımıza aktarılmaz.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">6. Üçüncü Taraflarla Paylaşım</h2>
              <p>
                Kişisel verilerinizi, yasal zorunluluklar dışında üçüncü taraflarla satmayız veya kiralamayız. Google Analytics, Google AdSense gibi hizmet sağlayıcılar kendi gizlilik politikalarına tabidir.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">7. İletişim</h2>
              <p>
                Gizlilik politikanızla ilgili sorularınız için{" "}
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
