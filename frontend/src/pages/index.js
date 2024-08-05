import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("jpeg");
  const [loading, setLoading] = useState(false);
  const [convertedImage, setConvertedImage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("format", format);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setConvertedImage(data.url);
      } else {
        alert("Failed to convert image.");
      }
    } catch (error) {
      alert("Error occurred.");
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
      {convertedImage && (
        <div>
          <p>Conversion Complete:</p>
          <img src={convertedImage} alt="Converted" />
        </div>
      )}
    </div>
  );
}
