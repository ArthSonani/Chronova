import Link from "next/link";

const Nav = () => {
  return (
    <nav className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 shadow-sm">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Timexa
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/reserve"
              className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Reserve
            </Link>
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
            <Link
              href="/logout"
              className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
            >
              Logout
            </Link>
          </div>
        </nav>
  )
}

export default Nav