import Link from "next/link";
import { connectToDB } from "@/utils/database";
import Event from "@/models/event";

const formatTime = (date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

async function getTodayEvents() {
  await connectToDB();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const events = await Event.find({
    start: { $lte: endOfDay },
    end: { $gte: startOfDay },
  })
    .sort({ start: 1 })
    .lean();

  return events.map((event) => ({
    id: event._id.toString(),
    title: event.title,
    start: event.start,
    end: event.end,
  }));
}

export default async function Home() {
  const todayEvents = await getTodayEvents();
  const todayLabel = formatDate(new Date());

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Today
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
                Your schedule for Today <span className="text-sm font-normal">[{todayLabel}]</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
                A quick glance at everything you have planned for today.
              </p>
            </div>
            <Link
              href="/calendar"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open Calendar
            </Link>
          </div>

          <div className="grid gap-4">
            {todayEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No events scheduled for today.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Enjoy the free time or add something new.
                </p>
              </div>
            ) : (
              todayEvents.map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {event.title}
                    </h2>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {formatTime(new Date(event.start))} – {formatTime(new Date(event.end))}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {formatDate(new Date(event.start))}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
