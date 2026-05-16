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

  // Load history on mount to compute stats
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getResumeHistory();
        if (data.success) {
          setResumes(data.resumes || []);
        } else {
          setError("Could not load your history.");
        }
      } catch {
        setError("Network error loading history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // ── Derived stats ────────────────────────────────────────
  const totalAnalyses = resumes.length;

  // Average ATS score across all resumes that have a parseable score
  const scores = resumes
    .map((r) => extractATSScore(r.feedback))
    .filter((s) => s !== null);
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

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
        <p className="text-2xl font-display font-bold text-dark">{value ?? "—"}</p>
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
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-dark">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your resume performance and improvements.
          </p>
        </div>
        <Link to="/analyze" className="btn-primary w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              }
            />
            <StatCard
              label="Average ATS Score"
              value={avgScore !== null ? `${avgScore}/100` : "—"}
              sub={avgScore !== null ? "across all analyses" : "no data yet"}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              }
            />
            <StatCard
              label="Best Score"
              value={bestScore !== null ? `${bestScore}/100` : "—"}
              sub={bestScore !== null ? "your highest result" : "no data yet"}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              }
            />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/analyze"
              className="card flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 group-hover:bg-brand-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-dark">Analyze New Resume</p>
                <p className="text-sm text-gray-500">Upload PDF/DOCX and get instant feedback</p>
              </div>
            </Link>

            <Link
              to="/history"
              className="card flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-dark">View Analysis History</p>
                <p className="text-sm text-gray-500">Browse all your past resume analyses</p>
              </div>
            </Link>
          </div>

          {/* Recent analyses */}
          {recentAnalyses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-dark">Recent Analyses</h2>
                <Link to="/history" className="text-sm text-brand-600 hover:underline font-medium">
                  View all →
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {recentAnalyses.map((r) => {
                  const score = extractATSScore(r.feedback);
                  return (
                    <div key={r._id} className="card flex items-center justify-between gap-4 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-dark truncate">{r.resume?.filename}</p>
                          <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {score !== null && (
                          <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                            {score}/100
                          </span>
                        )}
                        <Link to={`/result/${r._id}`} state={{ resume: r }} className="btn-outline py-1.5 px-3 text-xs">
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
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-dark mb-2">No analyses yet</h3>
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
