"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionFormat, setConversionFormat] = useState("jpeg");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state

  // Função auxiliar para validar o arquivo selecionado
  const validateFile = (file: File | null): string | null => {
    if (!file) return null;
    if (!file.type.includes("webp")) {
      return "Only .webp files are supported.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size exceeds the 5MB limit.";
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
      setProgress(0);
      setErrorMessage(null);
    }
  };

  /**
   * handleConversion - Função responsável por enviar uma imagem para o backend para conversão,
   * monitorando o progresso de upload e download, e gerenciando o estado da aplicação.
   *
   * Essa função lida com o upload de uma imagem .webp, solicita a conversão para o formato
   * escolhido pelo usuário (JPEG ou PNG), e fornece um link para download da imagem convertida.
   * Em caso de erros, a função exibe uma mensagem de erro apropriada para o usuário.
   */
  const handleConversion = async () => {
    // Verifica se um arquivo foi selecionado antes de prosseguir
    if (!selectedFile) {
      console.warn("No file selected for conversion.");
      return;
    }

    // Inicia o estado de carregamento
    setLoading(true);

    // Prepara os dados do formulário para enviar ao backend
    const formData = new FormData();
    formData.append("image", selectedFile); // Anexa a imagem selecionada
    formData.append("format", conversionFormat); // Anexa o formato de conversão desejado

    try {
      // Envia a requisição POST para o backend para realizar a conversão
      const response = await axios.post(
        "http://localhost:5000/api/convert", // Certifique-se de que a URL corresponde à rota do backend
        formData,
        {
          responseType: "blob", // Importante para garantir que a resposta seja tratada como um arquivo binário
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              // Calcula a porcentagem do upload completado
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted); // Atualiza o estado do progresso de upload
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              // Calcula a porcentagem do download completado
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted); // Atualiza o estado do progresso de download
              console.log(`Download progress: ${percentCompleted}%`);
            }
          },
        }
      );

      // Cria uma URL para o arquivo baixado e atualiza o estado para permitir o download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url); // Armazena a URL para o arquivo convertido
      setProgress(100); // Garante que o progresso seja 100% após a conclusão
      console.log("Image conversion successful, download URL created.");
    } catch (error) {
      // Captura e trata erros que ocorrem durante o processo de conversão
      console.error("Error converting image:", error);

      // Define uma mensagem de erro apropriada para exibir ao usuário
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to convert image. Please try again."
      );
    } finally {
      // Finaliza o estado de carregamento, seja qual for o resultado
      setLoading(false);
    }
  };

  // Limpeza da URL de download após o usuário baixar o arquivo
  useEffect(() => {
    if (downloadUrl) {
      return () => {
        window.URL.revokeObjectURL(downloadUrl); // Libera a URL criada para download
      };
    }
  }, [downloadUrl]);

  // Feedback visual para o erro e remoção automática após alguns segundos
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
        <label htmlFor="formatSelect" className="block mb-2">
          Choose a format:
        </label>
        <select
          id="formatSelect"
          value={conversionFormat}
          onChange={(e) => setConversionFormat(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label="Select image format for conversion"
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
        {loading ? "Converting..." : "Convert Image"}
      </button>
      {loading && (
        <div className="w-full max-w-lg mt-4">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded progress-bar"
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

      {errorMessage && (
        <div className="mt-4 text-red-500 animate-pulse">{errorMessage}</div>
      )}
    </div>
  );
}
