import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const port = 5000;

const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.post(
  "/api/convert",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const { format } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const validFormats = ["jpeg", "png"];
    if (!validFormats.includes(format)) {
      return res.status(400).send("Invalid format.");
    }

    try {
      const outputFormat = format === "jpeg" ? "jpeg" : "png";
      const outputPath = path.join(
        "converted",
        `${Date.now()}.${outputFormat}`
      );

      await sharp(file.path).toFormat(outputFormat).toFile(outputPath);

      fs.unlinkSync(file.path);

      res.json({ url: `/converted/${path.basename(outputPath)}` });
    } catch (error) {
      res.status(500).send("Error processing image.");
    }
  }
);

app.use("/converted", express.static("converted"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app; // Exportação padrão
