import Link from "next/link";
import { Footer } from "@/app/components/footer";

export const metadata = {
  title: "Privacy Policy | NexusConvert",
  description: "NexusConvert privacy policy. Cookies, data collection and user privacy.",
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
          <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Last updated: February 2025</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">1. Introduction</h2>
              <p>
                At NexusConvert (&quot;we&quot;, &quot;us&quot; or &quot;the site&quot;) we value your privacy. This Privacy Policy explains how we handle information collected when you visit our site or use our services.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">2. Information We Collect</h2>
              <p>
                NexusConvert largely offers browser-based (client-side) file conversion tools. Files you upload are processed directly on your device for most tools and are not sent to our servers. The exception is the Background Remover (AI) tool, where the image you submit is processed temporarily on our server for background removal.
              </p>
              <p className="mt-3">
                Information collected automatically: IP address, browser type, operating system, pages visited, visit duration and similar technical data.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">3. Cookies</h2>
              <p>
                Our site may use cookies to improve your experience and analyze our services. Types of cookies we use:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li><strong>Essential cookies:</strong> Required for basic site functionality.</li>
                <li><strong>Analytics cookies:</strong> To understand visitor numbers and page usage (e.g. Google Analytics).</li>
                <li><strong>Advertising cookies:</strong> Google AdSense or similar ad networks may use cookies to show you relevant ads.</li>
              </ul>
              <p className="mt-3">
                You can disable cookies in your browser settings; however, some features of the site may not work properly.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">4. Google AdSense and Advertising</h2>
              <p>
                Our site may display Google AdSense ads. Google uses cookies and similar technologies to show more relevant ads. For more on Google&apos;s advertising and privacy policies, see{" "}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  Google Advertising Policy
                </a>{" "}
                and{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                  Google Privacy Policy
                </a>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">5. Data Protection</h2>
              <p>
                We take reasonable security measures to protect the data we collect from unauthorized access, loss or alteration. Since most file conversion happens on your device, uploaded files are not transferred to our servers.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">6. Sharing with Third Parties</h2>
              <p>
                We do not sell or rent your personal data to third parties except where required by law. Service providers such as Google Analytics and Google AdSense are subject to their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">7. Contact</h2>
              <p>
                For questions about this privacy policy, you can reach us via our{" "}
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
