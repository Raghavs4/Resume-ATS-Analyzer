/**
 * Format bytes into a human-readable string (e.g. "512 KB").
 */
export const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Format a date string to a readable format.
 * e.g. "Jan 11, 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Extract ATS score (number) from the Gemini feedback string.
 * The feedback typically contains "ATS Score: XX" or "ATS Score (out of 100): XX"
 * Returns a number or null if not found.
 */
export const extractATSScore = (feedback) => {
  if (!feedback) return null;
  // Match patterns like "ATS Score: 78" or "ATS Score (out of 100): 78" or "**ATS Score:** 78/100"
  const patterns = [
    /ATS\s+Score[^:]*:\s*\**\s*(\d{1,3})/i,
    /(\d{1,3})\s*\/\s*100/,
    /Score[^:]*:\s*(\d{1,3})/i,
  ];
  for (const pattern of patterns) {
    const match = feedback.match(pattern);
    if (match) {
      const score = parseInt(match[1], 10);
      if (score >= 0 && score <= 100) return score;
    }
  }
  return null;
};

/**
 * Returns a colour class based on ATS score value.
 */
export const getScoreColor = (score) => {
  if (score === null) return "text-gray-400";
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-500";
};

/**
 * Returns a background colour class based on ATS score value.
 */
export const getScoreBg = (score) => {
  if (score === null) return "bg-gray-100";
  if (score >= 75) return "bg-green-50 border-green-200";
  if (score >= 50) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};
