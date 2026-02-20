"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden max-w-[120px] truncate text-sm text-slate-600 dark:text-slate-400 sm:block">
          {session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/giris"
        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        Sign In
      </Link>
      <Link
        href="/kayit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Sign Up
      </Link>
    </div>
  );
}
