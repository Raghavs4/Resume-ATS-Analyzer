import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/resumeService";
import {
  validateResumeFile,
  validateJobDescription,
} from "../utils/validators";
import { formatBytes } from "../utils/helpers";
import Alert from "../components/common/Alert";
import Spinner from "../components/common/Spinner";

/**
 * AnalyzePage — form to upload resume + job description for ATS analysis.
 * Protected route — only accessible when logged in.
 *
 * Flow:
 *  1. User selects PDF/DOCX file (≤ 1MB)
 *  2. User enters job description (min 20 chars)
 *  3. On submit → POST /api/resume/upload (multipart)
 *  4. Backend returns { success, feedback, resumeId }
 *  5. Redirect to /result/:id with feedback in location state
 */
const AnalyzePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ── State ─────────────────────────────────────────────
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [fileError, setFileError] = useState("");
  const [jdError, setJdError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Drag-and-drop visual state
  const [isDragging, setIsDragging] = useState(false);

  // ── File handlers ──────────────────────────────────────
  const handleFileChange = (selectedFile) => {
    const err = validateResumeFile(selectedFile);
    setFileError(err);
    if (!err) setFile(selectedFile);
    else setFile(null);
  };

  const onFileInputChange = (e) => {
    handleFileChange(e.target.files[0] || null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0] || null);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const removeFile = () => {
    setFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate both fields before submitting
    const fErr = validateResumeFile(file);
    const jErr = validateJobDescription(jobDescription);
    setFileError(fErr);
    setJdError(jErr);
    if (fErr || jErr) return;

    setLoading(true);
    try {
      const data = await uploadResume(file, jobDescription);

      if (!data.success) {
        setApiError(data.message || "Analysis failed. Please try again.");
        return;
      }

      // Redirect to results page, passing feedback + resumeId via state
      navigate(`/result/${data.resumeId}`, {
        state: { feedback: data.feedback, resumeId: data.resumeId },
      });
    } catch (err) {
      // Handle HTTP error responses (backend returns status 400/500)
      const msg =
        err.response?.data?.message ||
        "Network error. Please check your connection.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark">Analyze Resume</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload your resume and paste a job description to get your ATS score.
        </p>
      </div>

      {/* API error */}
      {apiError && (
        <Alert type="error" message={apiError} onClose={() => setApiError("")} />
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* ── File upload area ─────────────────────────── */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Resume File <span className="text-red-500">*</span>
          </label>

          {/* Drop zone */}
          {!file ? (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-brand-400 bg-brand-50"
                  : fileError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-dark mb-1">
                Drag &amp; drop or{" "}
                <span className="text-brand-600 underline">browse</span>
              </p>
              <p className="text-xs text-gray-400">PDF or DOCX — max 1 MB</p>
            </div>
          ) : (
            /* Selected file preview */
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                aria-label="Remove file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFileInputChange}
            className="hidden"
          />

          {/* File error */}
          {fileError && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {fileError}
            </p>
          )}
        </div>

        {/* ── Job description textarea ──────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (jdError) setJdError("");
            }}
            rows={8}
            placeholder="Paste the full job description here. The more detail you provide, the more accurate the ATS analysis will be..."
            disabled={loading}
            aria-invalid={!!jdError}
            className={`form-input resize-y min-h-[150px] ${
              jdError ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""
            }`}
          />
          <div className="flex justify-between items-center">
            {jdError ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {jdError}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">{jobDescription.length} chars</span>
          </div>
        </div>

        {/* ── Info note ─────────────────────────────────── */}
        <div className="flex gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>
            Analysis is powered by <strong>Google Gemini AI</strong> and may take
            10–30 seconds. Please do not close this page.
          </p>
        </div>

        {/* ── Submit button ────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-base"
        >
          {loading ? (
            <>
              <Spinner size="sm" color="border-white" />
              Analyzing… please wait
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analyze Resume
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalyzePage;
