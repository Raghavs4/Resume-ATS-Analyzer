import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { getResumeHistory } from "../services/resumeService";
import {
  extractATSScore,
  getScoreColor,
  getScoreBg,
  formatDate,
  formatBytes,
} from "../utils/helpers";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";

/**
 * ResultPage — displays the ATS feedback for a specific resume analysis.
 *
 * Data source priority:
 *  1. location.state (passed from AnalyzePage on fresh analysis)
 *  2. Fetch from history API and find by resumeId (when navigating directly)
 */
const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [feedback, setFeedback] = useState(location.state?.feedback || null);
  const [loading, setLoading] = useState(!location.state?.feedback);
  const [error, setError] = useState("");

  // If we don't have feedback in state, fetch from history
  useEffect(() => {
    if (feedback) return; // already have it

    const fetchFromHistory = async () => {
      setLoading(true);
      try {
        const data = await getResumeHistory();
        if (data.success) {
          const found = data.resumes.find((r) => r._id === id);
          if (found) {
            setFeedback(found.feedback);
            setResume(found);
          } else {
            setError("Analysis not found. It may have been deleted.");
          }
        } else {
          setError("Could not load the analysis.");
        }
      } catch {
        setError("Network error loading analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchFromHistory();
  }, [id, feedback]);

  // Also use the resume object from state if available
  useEffect(() => {
    if (location.state?.resume) setResume(location.state.resume);
  }, [location.state]);

  // ── Derived values ───────────────────────────────────
  const score = extractATSScore(feedback);
  const scoreColor = getScoreColor(score);
  const scoreBg = getScoreBg(score);

  const scoreLabel =
    score === null ? "N/A"
    : score >= 75 ? "Good"
    : score >= 50 ? "Average"
    : "Needs Work";

  const scoreDesc =
    score === null ? "Score could not be extracted."
    : score >= 75 ? "Your resume is well-optimised for ATS."
    : score >= 50 ? "Room for improvement — read the feedback below."
    : "Significant changes recommended to pass ATS filters.";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">Loading your analysis…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <Alert type="error" message={error} />
        <div className="flex gap-3">
          <Link to="/history" className="btn-outline">← View History</Link>
          <Link to="/analyze" className="btn-primary">New Analysis</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto fade-in space-y-6">
      {/* Breadcrumb / back */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button onClick={() => navigate(-1)} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <span>/</span>
        <span className="text-dark font-medium">Analysis Result</span>
      </div>

      {/* ── Score card ──────────────────────────────────── */}
      <div className={`card border-2 ${scoreBg} flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8`}>
        {/* Big score number */}
        <div className="text-center sm:text-left shrink-0">
          <p className="text-6xl sm:text-7xl font-display font-bold leading-none">
            <span className={scoreColor}>{score ?? "—"}</span>
            {score !== null && <span className="text-2xl text-gray-400 font-sans font-normal">/100</span>}
          </p>
          <p className={`text-sm font-semibold mt-2 ${scoreColor}`}>{scoreLabel}</p>
        </div>

        <div className="h-px sm:h-16 w-full sm:w-px bg-gray-200 shrink-0" />

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-display font-bold text-dark mb-1.5">ATS Compatibility Score</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{scoreDesc}</p>
          {resume && (
            <p className="text-xs text-gray-400 mt-3">
              {resume.resume?.filename} · {formatDate(resume.createdAt)}
              {resume.resume?.filesize && ` · ${formatBytes(resume.resume.filesize)}`}
            </p>
          )}
        </div>
      </div>

      {/* ── Score bar ───────────────────────────────────── */}
      {score !== null && (
        <div className="card">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-400" : "bg-red-400"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-red-400 font-medium">Poor (&lt;50)</span>
            <span className="text-yellow-500 font-medium">Average (50–74)</span>
            <span className="text-green-500 font-medium">Good (75+)</span>
          </div>
        </div>
      )}

      {/* ── Full feedback ────────────────────────────────── */}
      <div className="card">
        <h3 className="font-display font-bold text-dark text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          Detailed AI Feedback
        </h3>
        {/* Render the feedback as pre-formatted text, preserving Gemini's formatting */}
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans bg-gray-50 rounded-xl p-5 border border-gray-100">
            {feedback}
          </pre>
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 pb-4">
        <Link to="/analyze" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Analyze Another Resume
        </Link>
        <Link to="/history" className="btn-outline">
          View All History
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;
