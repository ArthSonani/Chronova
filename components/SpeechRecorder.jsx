"use client";

import { useEffect, useRef, useState } from "react";

export default function SpeechRecorder({ onText, disabled = false }) {
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      recognitionRef.current = null;
    };
  }, []);

  const ensureRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript && onText) onText(transcript);
    };

    recognition.onerror = (event) => {
      const code = event.error || "";
      if (code === "network") {
        setError(
          "Network error. Check your internet connection or try Chrome/Edge with HTTPS or localhost."
        );
      } else {
        setError(code || "Speech recognition error.");
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  const start = () => {
    if (disabled) return;
    setError("");

    const recognition = ensureRecognition();
    if (!recognition) return;

    try {
      recognition.abort?.();
      recognition.start();
    } catch (err) {
      setError("Unable to start recording.");
      setIsRecording(false);
    }
  };

  const stop = () => {
    recognitionRef.current?.stop?.();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stop();
    } else {
      start();
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Hold to speak your schedule.
      </p>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`h-12 w-12 rounded-full text-lg text-white transition ${
            isRecording ? "bg-red-500" : "bg-slate-900"
          } ${disabled ? "opacity-60" : "hover:bg-slate-800"}`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? "■" : "🎤"}
        </button>

        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700">
            {isRecording ? "Listening... tap to stop" : "Tap to start"}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${
                isRecording ? "w-3/4 bg-red-500" : "w-0"
              }`}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
