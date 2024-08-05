"use client";

import { useState, ChangeEvent } from "react";

interface ConvertResponse {
  url: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [loading, setLoading] = useState(false);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormatChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("format", format);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: ConvertResponse = await response.json();
        setConvertedImage(data.url);
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (error) {
      setError("Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <input type="file" onChange={handleFileChange} />
      <select value={format} onChange={handleFormatChange}>
        <option value="jpeg">JPEG</option>
        <option value="png">PNG</option>
      </select>
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Converting..." : "Convert Image"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {convertedImage && (
        <div>
          <p>Conversion Complete:</p>
          <img src={convertedImage} alt="Converted" />
          <a href={convertedImage} download>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
              Download Image
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
