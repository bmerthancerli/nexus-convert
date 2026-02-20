import Link from "next/link";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "Terms of Use | NexusConvert",
  description: "NexusConvert terms of use. Service terms and user obligations.",
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
              About
            </Link>
            <Link href="/iletisim" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Terms of Use</h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Last updated: February 2025</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">1. Scope of Service</h2>
              <p>
                NexusConvert is a web platform that provides online file conversion tools. These services include conversion of audio, video, image and other file formats. By using our services you agree to these Terms of Use.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">2. Rules of Use</h2>
              <p>When using our site and tools you must comply with the following rules:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Use for illegal purposes is prohibited.</li>
                <li>Uploading content that infringes copyright, trademark or other intellectual property rights is prohibited.</li>
                <li>Uploading files containing malware, viruses or malicious code is prohibited.</li>
                <li>Sending automated requests (bots, scraping, etc.) that overload or disrupt the system is prohibited.</li>
                <li>Using our service to harm others is prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">3. Disclaimer</h2>
              <p>
                NexusConvert is provided &quot;as is&quot;. We do not guarantee that our services are uninterrupted, error-free or secure. We cannot be held responsible for the results of file conversion or possible data loss. We recommend that you always keep backups of important files.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">4. Files and Privacy</h2>
              <p>
                For most of our tools, your files are processed only in your browser (on your device) and are not sent to our servers. The Background Remover (AI) tool is an exception; images are processed temporarily on our server. For details, see our{" "}
                <Link href="/gizlilik-politikasi" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  Privacy Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">5. Changes to Service</h2>
              <p>
                NexusConvert reserves the right to change, update or discontinue services without prior notice. Such changes will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">6. Governing Law</h2>
              <p>
                These Terms of Use are governed by applicable law. Disputes shall be subject to the courts of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">7. Contact</h2>
              <p>
                For questions, you can reach us via our{" "}
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
