import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 px-6 py-8 dark:border-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 sm:text-left">
            Your files are never uploaded to any server; 100% privacy, processed on your device.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/gizlilik-politikasi" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/kullanim-kosullari" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
              Terms of Use
            </Link>
            <Link href="/hakkinda" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
              About
            </Link>
            <Link href="/iletisim" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
              Contact
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} NexusConvert. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
