"use client";

import { useState } from "react";

const ReservePage = () => {
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
    <div className="mx-auto w-full max-w-xl px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">
          Reserve a time
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create an event only if the slot is free.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Meeting"
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Start</label>
            <input
              type="datetime-local"
              name="start"
              value={form.start}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {status.message && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
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
              className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {suggesting ? "Finding slots..." : "Suggest free time slots"}
            </button>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Available slots
              </p>
              <div className="space-y-2">
                {suggestions.map((slot) => (
                  <div
                    key={`${slot.start}-${slot.end}`}
                    className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm"
                  >
                    <span className="text-slate-700">
                      {new Date(slot.start).toLocaleString()} — {new Date(slot.end).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReserveSuggestion(slot)}
                      className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      Reserve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Reserving..." : "Reserve"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservePage;