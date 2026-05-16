import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getGeminiFeedback = async (resumeText, jobDescription) => {
  const prompt = `
Analyze this resume against the job description and generate:
1. ATS Score (out of 100)
2. Improvement feedback in 300 words

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // ✅ EXACT & SUPPORTED
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  return response.text;
};
