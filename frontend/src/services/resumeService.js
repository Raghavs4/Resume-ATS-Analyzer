import api from "./api";

/**
 * Upload a resume for ATS analysis.
 * POST /api/resume/upload
 * Requires: Authorization header (JWT)
 * Form fields:
 *   - resume (File) — PDF or DOCX, max 1MB
 *   - jobDescription (string)
 * Returns: { success, feedback, resumeId }
 */
export const uploadResume = async (file, jobDescription) => {
  // Use FormData because we are sending a file (multipart/form-data)
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  const { data } = await api.post("/resume/upload", formData, {
    headers: {
      // Override Content-Type so Axios sets the correct multipart boundary
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/**
 * Fetch the logged-in user's past resume analyses.
 * GET /api/resume/history
 * Requires: Authorization header (JWT)
 * Returns: { success, count, resumes: [...] }
 */
export const getResumeHistory = async () => {
  const { data } = await api.get("/resume/history");
  return data;
};
