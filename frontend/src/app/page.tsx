"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionFormat, setConversionFormat] = useState("jpeg");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      if (!file.type.includes("webp")) {
        setErrorMessage("Only .webp files are supported.");
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrorMessage("File size exceeds the 5MB limit.");
        setSelectedFile(null);
        return;
      }
    }

    setSelectedFile(file);
    setProgress(0);
    setErrorMessage(null);
  };

  const handleConversion = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("format", conversionFormat);

    try {
      const response = await axios.post(
        "http://localhost:5000/convert",
        formData,
        {
          responseType: "blob", // Important for downloading files
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted); // Update upload progress
            }
          },
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted); // Update download progress
            }
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setProgress(100); // Ensure progress is set to 100% after completion
    } catch (error) {
      console.error("Error converting image:", error);
      setErrorMessage("Failed to convert image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-6">WEBP to JPEG/PNG Converter</h1>
      <div className="mb-4">
        <label htmlFor="fileInput">Select a .webp file:</label>
        <input
          type="file"
          id="fileInput"
          accept="image/webp"
          onChange={handleFileChange}
        />
      </div>
      <div className="mb-4">
        <select
          value={conversionFormat}
          onChange={(e) => setConversionFormat(e.target.value)}
          className="border rounded px-2 py-1"
          title="Conversion Format"
        >
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
        </select>
      </div>
      <button
        onClick={handleConversion}
        disabled={!selectedFile || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-500"
      >
        Convert Image
      </button>

      {loading && (
        <div className="w-full max-w-lg mt-4">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center mt-2">{progress}%</div>
        </div>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={`converted.${conversionFormat}`}
          className="mt-4 text-blue-600 underline"
        >
          Download Converted Image
        </a>
      )}

      {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
    </div>
  );
}
