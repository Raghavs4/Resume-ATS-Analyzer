import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ NOW this WILL be a function

export const extractTextFromFile = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("File buffer missing");
  }

  const mimeType = file.mimetype;

  if (mimeType === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value;
  }

  throw new Error("Unsupported file type");
};
