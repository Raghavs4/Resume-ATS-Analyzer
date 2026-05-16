import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResumeHistory } from "../services/resumeService";
import { extractATSScore, getScoreColor, formatDate } from "../utils/helpers";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";

/**
 * DashboardPage — protected home screen for logged-in users.
 * Shows summary stats and quick links.
 * Fetches resume history to display counts and recent analyses.
 */
const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch history
  const fetchHistory = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("ats_token");

      // Prevent API call if token doesn't exist yet
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getResumeHistory();

      if (data.success) {
        setResumes(data.resumes || []);
        setError("");
      } else {
        setError("Could not load your history.");
      }
    } catch (error) {
      console.log(error);
      setError("Network error loading history.");
    } finally {
      setLoading(false);
    }
  };

  // Load history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // ── Derived stats ────────────────────────────────────────
  const totalAnalyses = resumes.length;

  // Average ATS score across all resumes that have a parseable score
  const scores = resumes
    .map((r) => extractATSScore(r.feedback))
    .filter((s) => s !== null);

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

  // Best score
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;

  // Most recent 3 analyses
  const recentAnalyses = resumes.slice(0, 3);

  const StatCard = ({ label, value, sub, icon }) => (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-display font-bold text-dark">
          {value ?? "—"}
        </p>

        <p className="text-sm font-medium text-dark">{label}</p>

        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );

  return (
    <div className="fade-in space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark">
            Dashboard
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Track your resume performance and improvements.
          </p>
        </div>

        <Link to="/analyze" className="btn-primary w-fit">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          New Analysis
        </Link>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {error && <Alert type="warning" message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Analyses"
              value={totalAnalyses}
              sub="resumes uploaded"
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75"
                  />
                </svg>
              }
            />

            <StatCard
              label="Average ATS Score"
              value={avgScore !== null ? `${avgScore}/100` : "—"}
              sub={
                avgScore !== null
                  ? "across all analyses"
                  : "no data yet"
              }
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 14.25v2.25"
                  />
                </svg>
              }
            />

            <StatCard
              label="Best Score"
              value={bestScore !== null ? `${bestScore}/100` : "—"}
              sub={
                bestScore !== null
                  ? "your highest result"
                  : "no data yet"
              }
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 18.75h-9"
                  />
                </svg>
              }
            />
          </div>

          {/* Recent analyses */}
          {recentAnalyses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-dark">
                  Recent Analyses
                </h2>

                <Link
                  to="/history"
                  className="text-sm text-brand-600 hover:underline font-medium"
                >
                  View all →
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {recentAnalyses.map((r) => {
                  const score = extractATSScore(r.feedback);

                  return (
                    <div
                      key={r._id}
                      className="card flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                          📄
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-dark truncate">
                            {r.resume?.filename}
                          </p>

                          <p className="text-xs text-gray-400">
                            {formatDate(r.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {score !== null && (
                          <span
                            className={`text-sm font-bold ${getScoreColor(
                              score
                            )}`}
                          >
                            {score}/100
                          </span>
                        )}

                        <Link
                          to={`/result/${r._id}`}
                          state={{ resume: r }}
                          className="btn-outline py-1.5 px-3 text-xs"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {totalAnalyses === 0 && !loading && (
            <div className="card text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-400 flex items-center justify-center mx-auto mb-4">
                📤
              </div>

              <h3 className="font-display font-bold text-dark mb-2">
                No analyses yet
              </h3>

              <p className="text-gray-500 text-sm mb-5">
                Upload your first resume to see your ATS compatibility score.
              </p>

              <Link to="/analyze" className="btn-primary">
                Analyze My Resume
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;