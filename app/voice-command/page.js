"use client";

import React from 'react'
import SpeechRecorder from "@/components/SpeechRecorder";

const VoiceCommandPage = () => {
    const [spokenText, setSpokenText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);

    const handleVoiceCommand = async (command)=>{
        setLoading(true);
        const response = await fetch("/api/voice-command", 
            { 
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ command }) 
            });
        const res = await response.json();
        setResult(res);
        setLoading(false);
    }
  return (
    <div>
        <h1>Voice Command Page</h1>
        <SpeechRecorder onText={setSpokenText} disabled={loading} />
        <p style={{ marginTop: '20px' }}>Spoken Command: {spokenText}</p>
        <button type='button' onClick={() => handleVoiceCommand(spokenText)} disabled={loading}>
            {loading ? "Processing..." : "Submit Command"}
        </button>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}

export default VoiceCommandPage