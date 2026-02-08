"use client";

import { useState } from "react";
import SpeechRecorder from "@/components/SpeechRecorder";

const ReserveVoiceCommand = () => {
  const [spokenText, setSpokenText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVoiceCommand = async (command) => {
    setLoading(true);
    const response = await fetch("/api/voice-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ command }),
    });
    const res = await response.json();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-5 pt-30">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Reserve by voice
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Speak your schedule and we will create the events for you.
        </p>

        <div className="mt-6 space-y-4">
          <SpeechRecorder onText={setSpokenText} disabled={loading} />
          {spokenText && (
            <p className="flex flex-col text-sm font-bold">
              Spoken Command: 
              <span className="font-medium text-gray-400">{spokenText}</span>
            </p>
          )}
          <button
            type="button"
            onClick={() => handleVoiceCommand(spokenText)}
            disabled={loading || !spokenText.trim()}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Submit Command"}
          </button>
          {result && (
            <pre className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReserveVoiceCommand;
