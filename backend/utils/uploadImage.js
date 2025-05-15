// utils/uploadImage.js

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (file) => {
  try {
    // Ensure the uploads folder exists
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const fileName = Date.now() + "_" + file.name;
    const filePath = path.join(uploadDir, fileName);

    // Move the file
    await file.mv(filePath); // Using express-fileupload or similar middleware
    return `/uploads/${fileName}`;
  } catch (err) {
    console.error("Error uploading image:", err);
    throw new Error("Image upload failed");
  }
};
