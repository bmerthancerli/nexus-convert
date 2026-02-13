import Link from "next/link";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "Kullanım Koşulları | NexusConvert",
  description: "NexusConvert kullanım koşulları. Hizmet şartları ve kullanıcı yükümlülükleri.",
};

export default function KullanimKosullariPage() {
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
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Kullanım Koşulları</h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Son güncelleme: Şubat 2025</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">1. Hizmetin Kapsamı</h2>
              <p>
                NexusConvert, çevrimiçi dosya dönüştürme araçları sunan bir web platformudur. Bu hizmetler, ses, video, görsel ve diğer dosya formatlarının dönüştürülmesini içerir. Hizmetlerimizi kullanarak bu Kullanım Koşullarını kabul etmiş sayılırsınız.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">2. Kullanım Kuralları</h2>
              <p>Sitemizi ve araçlarımızı kullanırken aşağıdaki kurallara uymanız gerekmektedir:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Yasalara aykırı amaçlarla kullanım yasaktır.</li>
                <li>Telif hakkı, ticari marka veya başkalarının fikri mülkiyet haklarını ihlal eden içeriklerin yüklenmesi yasaktır.</li>
                <li>Zararlı yazılım, virüs veya kötü niyetli kod içeren dosyaların yüklenmesi yasaktır.</li>
                <li>Sistemi aşırı yükleyecek veya bozacak otomatik istekler (bot, scraping vb.) göndermek yasaktır.</li>
                <li>Hizmetimizi başkalarına zarar vermek amacıyla kullanmak yasaktır.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">3. Sorumluluk Reddi</h2>
              <p>
                NexusConvert, &quot;olduğu gibi&quot; (as is) sunulmaktadır. Hizmetlerimizin kesintisiz, hatasız veya güvenli olduğunu garanti etmiyoruz. Dosya dönüştürme işlemlerinin sonuçlarından veya olası veri kaybından sorumlu tutulamayız. Önemli dosyalarınız için mutlaka yedek almanızı öneririz.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">4. Dosya ve Gizlilik</h2>
              <p>
                Çoğu aracımızda dosyalarınız yalnızca tarayıcınızda (cihazınızda) işlenir ve sunucularımıza aktarılmaz. Arka Plan Silici (AI) aracı istisnadır; bu araçta görseller geçici olarak sunucumuzda işlenir. Detaylı bilgi için{" "}
                <Link href="/gizlilik-politikasi" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  Gizlilik Politikamızı
                </Link>{" "}
                inceleyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">5. Hizmet Değişiklikleri</h2>
              <p>
                NexusConvert, hizmetleri önceden bildirimde bulunmaksızın değiştirme, güncelleme veya sonlandırma hakkını saklı tutar. Bu değişiklikler bu sayfada yayınlanacaktır.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">6. Uygulanacak Hukuk</h2>
              <p>
                Bu Kullanım Koşulları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda yetkili mahkemeler ve icra daireleri Türkiye mahkemeleridir.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">7. İletişim</h2>
              <p>
                Sorularınız için{" "}
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
