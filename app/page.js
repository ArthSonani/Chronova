"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDate, formatDuration, formatTime } from "../utils/dateFormate";

export default function Home() {
  const {data: session} = useSession();
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (!session) {
          setTodayEvents([]);
          return;
        }
        setLoading(true);
        setError("");
        const res = await fetch("/api/events/today", {
          credentials: "include",
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load events");
        }

        const data = await res.json();
        setTodayEvents(data);
      } catch (err) {
        setError(err?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [session]);

  return (
    <main className="min-h-screen px-2 pt-25">
      <section className="mx-auto max-w-5xl">
        <div className="h-auto flex flex-col gap-6 rounded-3xl p-5 shadow-xl shadow-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Today
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
                Your schedule for Today{" "}
                <span className="text-sm font-normal">
                  [{formatDate(new Date())}]
                </span>
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
            {loading && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                  Loading your events...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-center">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {!session && !loading && !error && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                  Please log in to see your schedule.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Your events will appear here once you log in.
                </p>
              </div>
            )}

            {session && !loading && !error && todayEvents.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No events scheduled for today.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Enjoy the free time or add something new.
                </p>
              </div>
            )}

            {!loading && !error && todayEvents.length > 0 && (
              <div className="grid gap-3 w-full sm:grid-cols-2">
                {todayEvents.map((event) => (
                  <article
                    key={event.id || `${event.title}-${event.start}`}
                    className="w-full overflow-hidden flex flex-col gap-3 rounded-2xl border border-gray-300 bg-white px-6 py-5 shadow-sm transition hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col items-start justify-between gap-3">
                      <h2 className="w-full text-lg font-semibold text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
                        {event.title}
                      </h2>
                      <span className="rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100">
                        Duration : {formatDuration(event.start, event.end)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
