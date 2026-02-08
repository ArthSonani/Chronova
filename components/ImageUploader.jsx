'use client';
import { useState } from 'react';

export default function ImageUploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({ file: null, date: "", weeks: 1 });

  const handleUpload = async (e) => {
    setLoading(true);

    const fd = new FormData();
    fd.append("file", formData.file);
    fd.append("date", formData.date);
    fd.append("weeks", formData.weeks);

    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const resJson = await res.json();
    setResult(resJson);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const fileName = formData.file?.name || "No file selected";

  return (
    <div className="min-h-[70vh] px-4 pt-30 pb-5">
      <div className="mx-auto w-full max-w-3xl">
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Timetable
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Upload your timetable image
            </h1>
            <p className="text-sm text-slate-500">
              We will read your image and create events automatically.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <label className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-sm text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50">
                <span className="text-sm font-semibold text-slate-800">
                  Timetable image
                </span>
                <span className="text-xs text-slate-500">
                  PNG or JPG, clear and readable.
                </span>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
                  {fileName}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={handleChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Start date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Weeks to generate
                </label>
                <input
                  type="number"
                  name="weeks"
                  value={formData.weeks}
                  onChange={handleChange}
                  disabled={loading}
                  min={1}
                  max={25}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !formData.file || !formData.date}
                className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "AI Processing..." : "Upload and reserve"}
              </button>
            </div>
          </div>

          {result && (
            <div className="pt-4 w-full">
              <pre className="w-full flex items-center overflow-auto text-xs text-green-700">
                {result.message}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}