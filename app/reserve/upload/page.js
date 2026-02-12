"use client";
import { useState } from "react";

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
    fd.append("timezoneOffset", new Date().getTimezoneOffset());

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
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-30 sm:pt-28">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/60">
            Timetable
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Upload your timetable image
          </h1>
          <p className="text-sm text-black/70 sm:text-base">
            We will read your image and create events automatically.
          </p>
        </div>

        <div className="grid gap-6 rounded-3xl border border-black/20 bg-white p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div className="space-y-4">
            <label className="flex flex-col gap-3 rounded-2xl border border-dashed border-black/30 bg-black/5 px-5 py-6 text-sm text-black/60 transition hover:border-black">
              <span className="text-sm font-semibold text-black">
                Timetable image
              </span>
              <span className="text-xs text-black/60">
                PNG or JPG, clear and readable.
              </span>
              <span className="rounded-full border border-black/20 bg-white px-3 py-2 text-xs font-medium text-black/70">
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
              <label className="text-sm font-medium text-black/80">
                Start date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black/80">
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
                className="mt-2 w-full rounded-xl border border-black/20 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {result && (<pre className="w-full overflow-auto text-center text-xs text-green-600">
              {result.message}
            </pre>)}

            <button
              onClick={handleUpload}
              disabled={loading || !formData.file || !formData.date}
              className="w-full rounded-xl border border-black bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed"
            >
              {loading ? "AI Processing..." : "Upload and reserve"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}