import resumeModel from "../model/resumeModel.js";
import userModel from "../model/userModel.js";
import { extractTextFromFile } from "../utils/fileUtils.js";
import { getGeminiFeedback } from "../utils/geminiUtils.js";
import cloudinary from "../config/cloudinary.js"; // ✅ FIXED

const uploadResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file || !jobDescription) {
      return res
        .status(400)
        .json({ message: "Resume file and job description are required" });
    }

    const resumeText = await extractTextFromFile(req.file);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "Unable to extract meaningful text from resume",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "resumes",          // ✅ FIXED
          resource_type: "raw",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const feedback = await getGeminiFeedback(resumeText, jobDescription);

    const resume = await resumeModel.create({
      user: req.user.id,
      resume: {
        url: uploadResult.secure_url,
        filename: req.file.originalname, // ✅ FIXED
        filetype: req.file.mimetype.includes("pdf") ? "pdf" : "docx",
        filesize: req.file.size,
      },
      jobDescription,
      feedback,
    });

    await userModel.findByIdAndUpdate(req.user.id, {
      $push: { resumes: resume._id },
    });

    res.status(201).json({
      success: true,
      feedback,
      resumeId: resume._id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getResumeHistory = async (req, res) => {
  try {
    const userId = req.user.id; // comes from auth middleware

    const resumes = await resumeModel
      .find({ user: userId })
      .sort({ createdAt: -1 }); // latest first

    res.json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { uploadResume , getResumeHistory};
