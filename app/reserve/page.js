import Link from "next/link";

const ReservePage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl p-5 pt-25">
      <div className=" bg-white p-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Reserve
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Choose how you want to reserve time
          </h1>
          <p className="text-sm text-slate-500">
            Pick a method below. You can always switch later.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/reserve/manual"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              ✍️
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Manual reserve
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create an event by selecting start and end time.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-emerald-600">
              Reserve manually →
            </span>
          </Link>

          <Link
            href="/reserve/upload"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              📷
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Upload timetable
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Upload an image and let the system create events.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-emerald-600">
              Upload & reserve →
            </span>
          </Link>

          <Link
            href="/reserve/command"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
              🎙️
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Voice command
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Speak your schedule and auto-create events.
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-emerald-600">
              Reserve by voice →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservePage;