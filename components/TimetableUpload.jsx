'use client';
import { useState } from 'react';

export default function TimetableUploader() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/timetable", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Timetable</h1>
      <input type="file" accept="image/*" onChange={handleUpload} disabled={loading} />
      
      {loading && <p>Processing with AI... 🤖</p>}

      {data && (
        <pre style={{ background: '#f4f4f4', padding: '10px', marginTop: '20px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}