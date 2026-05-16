import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
      ref: "User",                          // ✅ STRING + Capitalized
      required: true,
    },
    resume: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
      filetype: { type: String, enum: ["pdf", "docx"], required: true },
      filesize: { type: Number, required: true },
    },
    jobDescription: { type: String, required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Correct model reuse pattern
const Resume =
  mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;
