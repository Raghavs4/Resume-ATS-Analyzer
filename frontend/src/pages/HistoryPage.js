import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
 * HistoryPage — lists all past resume analyses for the logged-in user.
 * GET /api/resume/history → returns resumes sorted newest first.
 */
const HistoryPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getResumeHistory();
        if (data.success) {
          setResumes(data.resumes || []);
        } else {
          setError("Could not load history. Please try again.");
        }
      } catch {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="fade-in space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark">
            Analysis History
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {resumes.length > 0
              ? `You have ${resumes.length} past ${resumes.length === 1 ? "analysis" : "analyses"}.`
              : "All your past resume analyses will appear here."}
          </p>
        </div>
        <Link to="/analyze" className="btn-primary w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Analysis
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : resumes.length === 0 ? (
        /* Empty state */
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-dark mb-2">No history yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Analyze your first resume to start building your history.
          </p>
          <Link to="/analyze" className="btn-primary">
            Analyze My Resume
          </Link>
        </div>
      ) : (
        /* Resume list */
        <div className="flex flex-col gap-4">
          {resumes.map((r) => {
            const score = extractATSScore(r.feedback);
            const scoreBg = getScoreBg(score);
            const scoreCol = getScoreColor(score);

            return (
              <div
                key={r._id}
                className="card hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* File icon */}
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark truncate">{r.resume?.filename}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                    <span>{formatDate(r.createdAt)}</span>
                    {r.resume?.filesize && <span>{formatBytes(r.resume.filesize)}</span>}
                    <span className="uppercase font-medium text-gray-500">{r.resume?.filetype}</span>
                  </div>
                  {/* Job description preview */}
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">
                    JD: {r.jobDescription}
                  </p>
                </div>

                {/* Score badge */}
                <div className={`shrink-0 px-4 py-2 rounded-xl border text-center ${scoreBg}`}>
                  <p className={`text-xl font-display font-bold leading-none ${scoreCol}`}>
                    {score ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">/ 100</p>
                </div>

                {/* Action */}
                <Link
                  to={`/result/${r._id}`}
                  state={{ resume: r, feedback: r.feedback }}
                  className="btn-outline py-2 px-4 text-xs sm:shrink-0"
                >
                  View Result
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
