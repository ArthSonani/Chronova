"use client";

import { useState } from "react";
import SpeechRecorder from "@/components/SpeechRecorder";

const ReserveVoiceCommand = () => {
  const [spokenText, setSpokenText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVoiceCommand = async (command) => {
    setLoading(true);
    setError("");
    setResult(null);
    const response = await fetch("/api/voice-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ command }),
    });
    const res = await response.json();
    if (!response.ok) {
      setError(res?.error || "Failed to create events");
    } else {
      setResult(res);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-30 sm:pt-28">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/60">
            Voice
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Reserve by voice
          </h1>
          <p className="text-sm text-black/70 sm:text-base">
            Speak your schedule and we will create the events for you.
          </p>
        </div>

        <div className="rounded-3xl border border-black/20 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-4">
            <SpeechRecorder onText={setSpokenText} disabled={loading} />
            {spokenText && (
              <p className="flex flex-col text-sm font-semibold text-black">
                Spoken command
                <span className="font-normal text-black/60">{spokenText}</span>
              </p>
            )}

            {error && (
              <div className="px-3 py-2 text-center text-xs text-red-700">
                {error}
              </div>
            )}

            {result && (
              <pre className="px-3 py-2 text-center text-xs text-green-700">
                {result.message}
              </pre>
            )}

            <button
              type="button"
              onClick={() => handleVoiceCommand(spokenText)}
              disabled={loading || !spokenText.trim()}
              className="w-full cursor-pointer rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Submit command"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReserveVoiceCommand;
