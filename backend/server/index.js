// server/index.js
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

// Multer setup
const upload = multer({ dest: "uploads/" });

app.use(express.json());

// Route to convert image
app.post("/convert", upload.single("image"), async (req, res) => {
  const { format } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const outputPath = path.join(
    "converted",
    `${path.basename(
      file.originalname,
      path.extname(file.originalname)
    )}.${format}`
  );

  try {
    await sharp(file.path).toFormat(format).toFile(outputPath);

    res.send({ url: `/converted/${path.basename(outputPath)}` });
  } catch (error) {
    res.status(500).send("Conversion failed.");
  } finally {
    fs.unlinkSync(file.path);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
