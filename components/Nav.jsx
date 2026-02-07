"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Timexa
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            
            {!session? (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Register
                </Link>
              </>
              ) : (
                <>
                <Link
                  href="/reserve"
                  className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Reserve
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>

                </>
              )}
          </div>
        </nav>
  )
}

export default Nav