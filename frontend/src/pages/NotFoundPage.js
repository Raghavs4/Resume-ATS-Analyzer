import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * NotFoundPage — displayed for unmatched routes.
 */
const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center fade-in">
      <div className="text-center">
        <p className="text-8xl font-display font-bold text-brand-100 mb-2">404</p>
        <h1 className="text-2xl font-display font-bold text-dark mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="btn-primary"
        >
          {isAuthenticated ? "Go to Dashboard" : "Go Home"}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
