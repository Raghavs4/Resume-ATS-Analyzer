/**
 * Validation utilities for form fields.
 * All functions return an error string if invalid, or "" if valid.
 */

/** Name: 2–60 chars, no leading/trailing spaces */
export const validateName = (value) => {
  if (!value || !value.trim()) return "Name is required.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  if (value.trim().length > 60) return "Name must be 60 characters or fewer.";
  return "";
};

/** Email: basic format check */
export const validateEmail = (value) => {
  if (!value || !value.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) return "Enter a valid email address.";
  return "";
};

/**
 * Password: mirrors backend's validator.isStrongPassword defaults —
 * min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol.
 */
export const validatePassword = (value) => {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
  if (!/[0-9]/.test(value)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(value)) return "Password must include a special character (e.g. @, #, !).";
  return "";
};

/** Required generic field */
export const validateRequired = (value, label = "This field") => {
  if (!value || !value.toString().trim()) return `${label} is required.`;
  return "";
};

/**
 * Resume file:
 * - must be provided
 * - must be PDF or DOCX
 * - must be ≤ 1MB (backend limit)
 */
export const validateResumeFile = (file) => {
  if (!file) return "Please select a resume file.";
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowed.includes(file.type)) return "Only PDF or DOCX files are allowed.";
  if (file.size > 1024 * 1024) return "File size must be 1 MB or less.";
  return "";
};

/** Job description: non-empty, min 20 chars */
export const validateJobDescription = (value) => {
  if (!value || !value.trim()) return "Job description is required.";
  if (value.trim().length < 20) return "Job description must be at least 20 characters.";
  return "";
};
