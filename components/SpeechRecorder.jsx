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

  const start = (event) => {
    event?.preventDefault?.();
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

  const stop = (event) => {
    event?.preventDefault?.();
    recognitionRef.current?.stop?.();
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ marginBottom: 8, fontSize: 14, color: "#374151" }}>
        Hold to speak your schedule. 
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 12,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <button
          type="button"
          onPointerDown={start}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          disabled={disabled}
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            border: "none",
            background: isRecording ? "#ef4444" : "#111827",
            color: "#fff",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isRecording
              ? "0 0 0 6px rgba(239,68,68,0.15)"
              : "none",
            transition: "all 0.2s ease",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          aria-label="Hold to record"
        >
          🎤
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            {isRecording ? "Listening... release to stop" : "Press and hold to speak"}
          </div>
          <div
            style={{
              marginTop: 6,
              height: 6,
              borderRadius: 999,
              background: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: isRecording ? "70%" : "0%",
                background: "#ef4444",
                transition: "width 0.2s ease",
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#dc2626" }}>
          {error}
        </div>
      )}
    </div>
  );
}
