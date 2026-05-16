import React from "react";

/**
 * Spinner — small inline loading indicator.
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} color - Tailwind border-color class (default brand blue)
 */
const Spinner = ({ size = "md", color = "border-brand-600" }) => {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-[3px]",
  };

  return (
    <span
      className={`inline-block rounded-full border-t-transparent ${sizeMap[size]} ${color} spinner`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
