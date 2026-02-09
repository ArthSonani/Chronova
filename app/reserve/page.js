import Link from "next/link";

const ReservePage = () => {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-30 sm:pt-28">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-black/60">
            Reserve
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Choose how you want to reserve time
          </h1>
          <p className="max-w-2xl text-sm text-black/70 sm:text-base">
            Pick a method below. You can always switch later.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/reserve/manual"
              className="group rounded-3xl border border-black/20 bg-white p-6 transition hover:border-black"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-white">
                <img
                  src="/manual.png"
                  alt="Manual reserve"
                  className="h-6 w-6 object-contain"
                  loading="lazy"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-black">
                Manual reserve
              </h2>
              <p className="mt-2 text-sm text-black/70">
                Create an event by selecting start and end time.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black/70">
                Reserve manually <span aria-hidden="true">→</span>
              </span>
            </Link>

            <Link
              href="/reserve/upload"
              className="group rounded-3xl border border-black/20 bg-white p-6 transition hover:border-black"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-white">
                <img
                  src="/upload.png"
                  alt="Upload timetable"
                  className="h-6 w-6 object-contain"
                  loading="lazy"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-black">
                Upload timetable
              </h2>
              <p className="mt-2 text-sm text-black/70">
                Upload an image and let the system create events.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black/70">
                Upload and reserve <span aria-hidden="true">→</span>
              </span>
            </Link>

            <Link
              href="/reserve/command"
              className="group rounded-3xl border border-black/20 bg-white p-6 transition hover:border-black sm:col-span-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-white">
                <img
                  src="/voice.png"
                  alt="Voice command"
                  className="h-6 w-6 object-contain"
                  loading="lazy"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-black">
                Voice command
              </h2>
              <p className="mt-2 text-sm text-black/70">
                Speak your schedule and auto-create events.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black/70">
                Reserve by voice <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                Tip
              </p>
              <h3 className="mt-3 text-xl font-semibold">Reserve with intent</h3>
              <p className="mt-3 text-sm text-black/70">
                Start with manual blocks for clarity, then automate with uploads
                or quick commands.
              </p>
            </div>
            <div className="rounded-3xl border border-dashed border-black/30 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                Quick links
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/calendar"
                  className="inline-flex items-center justify-center rounded-lg border border-black bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
                >
                  Open calendar
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-black/30 px-4 py-2 text-sm font-medium text-black transition hover:border-black"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReservePage;