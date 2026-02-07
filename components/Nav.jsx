"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-2xl border bg-black/80 px-6 py-4 shadow-sm backdrop-blur">
      <Link href="/" className="text-xl font-semibold text-white">
        Timexa
      </Link>
      <div className="flex items-center gap-3 text-sm font-medium">

        {!session ? (
          <>
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-white transition hover:text-[#bdbdbd]"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full px-4 py-2 text-black transition bg-white hover:bg-[#bdbdbd] hover:text-black"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/reserve"
              className="rounded-full px-4 py-2 text-white transition hover:text-[#bdbdbd]"
            >
              Reserve Slots
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full px-4 py-2 text-black transition bg-white hover:bg-[#bdbdbd] hover:text-black"
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