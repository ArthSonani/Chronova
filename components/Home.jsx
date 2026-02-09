"use client";

import Link from "next/link";

const Home = () => {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-30 sm:pt-28">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">
              Time planning, made clear
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Take Control of Your Time. Before It Controls You.
            </h1>
            <p className="max-w-2xl text-base text-black/70">
              Plan, reserve, and visualize your time with clarity. Upload timetables,
              add events manually, or use simple commands and let the system detect
              conflicts before they happen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/reserve"
              className="rounded-lg border border-black bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
            >
              Start Planning
            </Link>
            <Link
              href="/reserve/upload"
              className="rounded-lg border border-black/30 px-6 py-3 text-sm font-medium text-black transition hover:border-black"
            >
              Upload Weekly Timetable
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <div className="rounded-3xl border border-dashed border-black/30 bg-white p-6 lg:hidden">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                Image slot
              </p>
              <div className="mt-6 flex min-h-55 items-center justify-center bg-black/5">
                <img
                  src="/home-image-1.png"
                  alt="App Screenshot"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                What problem this solves
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Time planning is hard. We make it visible.
              </h2>
              <p className="mt-3 text-sm text-black/70">
                Most people do not waste time. They lose track of it. Overlapping
                meetings, forgotten commitments, and poorly planned weeks happen
                because time is not clearly reserved. This app helps you reserve
                time, understand where your hours go, and make better scheduling
                decisions.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-black/20 bg-white p-6">
                <h3 className="text-lg font-semibold">Manual Time Reservation</h3>
                <p className="mt-2 text-sm text-black/70">
                  Reserve time blocks intentionally for work sessions, classes,
                  meetings, and personal time. You decide how your time is spent.
                </p>
              </div>
              <div className="rounded-3xl border border-black/20 bg-white p-6">
                <h3 className="text-lg font-semibold">Smart Collision Detection</h3>
                <p className="mt-2 text-sm text-black/70">
                  Avoid overbooking. Detect overlapping events, get suggestions
                  when conflicts occur, and understand what clashes and why.
                </p>
              </div>
              <div className="rounded-3xl border border-black/20 bg-white p-6">
                <h3 className="text-lg font-semibold">Command-Based Scheduling</h3>
                <p className="mt-2 text-sm text-black/70">
                  Prefer speed? Use commands like: Reserve Monday 9am-11am for DSA
                  Practice. Fast, simple, powerful.
                </p>
              </div>
              <div className="rounded-3xl border border-black/20 bg-white p-6">
                <h3 className="text-lg font-semibold">Upload Weekly Timetables</h3>
                <p className="mt-2 text-sm text-black/70">
                  Upload your weekly timetable, convert it into time blocks
                  automatically, then edit and refine as needed.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-black/30 bg-white p-6 lg:hidden">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                Image slot
              </p>
              <div className="mt-6 flex min-h-55 items-center justify-center rounded-2xl border border-black/10 bg-black/5">
                <img
                  src="/home-image-2.png"
                  alt="App Screenshot"
                  className="h-full w-full rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="hidden flex-col gap-6 lg:flex">
            <div className="rounded-3xl border border-dashed border-black/30 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                Image slot
              </p>
              <div className="mt-6 flex min-h-55 items-center justify-center bg-black/5">
                <img
                  src="/home-image-1.png"
                  alt="App Screenshot"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-dashed border-black/30 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                Image slot
              </p>
              <div className="mt-6 flex min-h-55 items-center justify-center rounded-2xl border border-black/10 bg-black/5">
                <img
                  src="/home-image-2.png"
                  alt="App Screenshot"
                  className="h-full w-full rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-black p-8 text-white">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Who this is for
            </p>
            <h2 className="text-2xl font-semibold">
              Built for people who care about time
            </h2>
            <ul className="grid gap-2 text-sm text-white/80 sm:grid-cols-2">
              <li>Students managing classes, study, and prep time</li>
              <li>Developers juggling projects and meetings</li>
              <li>Professionals planning focused work sessions</li>
              <li>Anyone serious about time management</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-2xl font-semibold">
            Your time is limited. Plan it wisely.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-black/70">
            Start reserving time intentionally and avoid scheduling chaos.
          </p>
          <div className="mt-6">
            <Link
              href="/reserve"
              className="inline-flex rounded-lg border border-black bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
            >
              Build Your Week Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
