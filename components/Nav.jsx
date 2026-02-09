"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <div className="fixed left-0 right-0 top-0 w-screen h-20 bg-white z-60">
    <nav className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-2xl border border-gray-300 bg-white px-6 py-4 shadow-sm backdrop-blur">
      <Link href="/" className="text-xl font-semibold text-black">
        <img src="/logo.png" alt="Chronova Logo" width={30} height={30} className="inline-block mr-2" />
        Chronova
      </Link>
      <div className="flex items-center gap-1 sm:gap-3 text-sm font-medium">

        {!session ? (
          <>
            <Link
              href="/login"
              className="rounded-full px-2 sm:px-4 py-2 text-black transition hover:text-black/50"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full px-4 py-2 text-black transition bg-white hover:bg-black hover:text-white"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/reserve"
              className="rounded-full px-2 sm:px-4 py-2 text-black transition hover:text-black/50"
            >
              Reserve
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full px-4 py-2 text-black transition bg-white hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
    </div>
  )
}

export default Nav