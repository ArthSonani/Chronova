'use client';
import { useState } from 'react';

export default function TimetableUploader() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({ file: null, date: "", weeks: 1 });

  const handleUpload = async (e) => {
    setLoading(true);

    const fd = new FormData();
    fd.append("file", formData.file);
    fd.append("date", formData.date);
    fd.append("weeks", formData.weeks);

    const res = await fetch("/api/timetable", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const result = await res.json();
    setData(result);
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Timetable</h1>

      <input type="file" accept="image/*" name="file" onChange={handleChange} disabled={loading} />
      <input type="date" name="date" value={formData.date} onChange={handleChange} disabled={loading} />
      <input type="number" name="weeks" value={formData.weeks} onChange={handleChange} disabled={loading} min={1} max={25} />
      {loading && <p>Processing with AI... 🤖</p>}

      {data && (
        <pre style={{ background: '#f4f4f4', padding: '10px', marginTop: '20px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      <button onClick={handleUpload} disabled={loading}>Upload & Reserve</button>

       <br/><br/><br/><br/><br/><br/>
    </div>
  );
}