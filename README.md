# WEBP to JPEG/PNG - Image Converter

## Description

This is a complete project that allows users to convert images from `.webp` format to `.jpeg` or `.png`. 
The application consists of a frontend developed with **Next.js** and **Tailwind CSS** and a backend in **Node.js** using **Express**, **Multer** for file upload and **Sharp** for image conversion. Communication between the frontend and the backend is done via **Axios**.

## Features

- **Image Upload:** The user can upload a `.webp` image to be converted.
- **Image Conversion:** The image can be converted to `.jpeg` or `.png` formats.
- **Visual Feedback:** Progress bar for uploading and downloading the converted image.
- **Downloading Converted Image:** After conversion, the image can be downloaded directly from the browser.
- **Error Handling:** Clear error messages and feedback in case of problems during conversion.

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [React](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Axios](https://axios-http.com/)

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [Multer](https://github.com/expressjs/multer) - Upload de arquivos
  - [Sharp](https://sharp.pixelplumbing.com/) - Conversão de imagens
  - [CORS](https://github.com/expressjs/cors) - Middleware para habilitar CORS

- **Others:**
  - [TypeScript](https://www.typescriptlang.org/) - Static typing

## Installation and Configuration

### Pre-requisites

Make sure you have **Node.js** and **npm** installed on your machine.

### Cloning the Repository

```bash
git clone https://github.com/seu-usuario/webp-image-converter.git
cd webp-image-converter
