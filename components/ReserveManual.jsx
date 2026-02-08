"use client";

import { useState } from "react";
import { formatDate, formatTime } from "../utils/dateFormate";

const ReserveManual = () => {
  const [form, setForm] = useState({ title: "", start: "", end: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggesting, setSuggesting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: "", message: "" });
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          start: form.start,
          end: form.end,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Error" });
        return;
      }

      setStatus({ type: "success", message: "Reservation created." });
      setForm({ title: "", start: "", end: "" });
      setSuggestions([]);
    } catch (error) {
      setStatus({ type: "error", message: "Error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = async () => {
    if (!form.start || !form.end) return;
    setSuggesting(true);
    try {
      const res = await fetch("/api/reserve/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ start: form.start, end: form.end }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Error" });
        return;
      }
      setSuggestions(data.suggestions || []);
    } catch (error) {
      setStatus({ type: "error", message: "Error" });
    } finally {
      setSuggesting(false);
    }
  };

  const handleReserveSuggestion = async (slot) => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: form.title.trim(),
          start: slot.start,
          end: slot.end,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Error" });
        return;
      }
      setStatus({ type: "success", message: "Reservation created." });
      setForm({ title: "", start: "", end: "" });
      setSuggestions([]);
    } catch (error) {
      setStatus({ type: "error", message: "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] px-4 py-10 pt-30">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Manual reserve
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Plan your time, slot by slot.
            </h1>
            <p className="text-sm text-slate-500">
              Pick a start and end time. We will check conflicts before saving.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Team sync"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Start</label>
                <input
                  type="datetime-local"
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">End</label>
                <input
                  type="datetime-local"
                  name="end"
                  value={form.end}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {status.message && (
              <div
                className={`rounded-xl px-3 py-2 text-sm ${
                  status.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {status.message}
              </div>
            )}

            {status.type === "error" && status.message === "already occupied" && (
              <button
                type="button"
                onClick={handleSuggest}
                disabled={suggesting}
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {suggesting ? "Finding slots..." : "Suggest free time slots"}
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Reserving..." : "Reserve"}
            </button>
          </form>
        </div>

        {suggestions.length > 0 && (
          <div className="mx-auto mt-6 w-full max-w-5xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Available slots
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              {suggestions.map((slot) => (
                <div
                  key={`${slot.start}-${slot.end}`}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-slate-700">
                    {formatDate(new Date(slot.start))} — {formatDate(new Date(slot.end))}
                  </span>
                  <span className="text-slate-500">
                    {formatTime(new Date(slot.start))} - {formatTime(new Date(slot.end))}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleReserveSuggestion(slot)}
                    className="cursor-pointer rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Reserve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReserveManual;
