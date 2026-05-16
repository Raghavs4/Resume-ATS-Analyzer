import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Navbar — top navigation bar.
 * Shows different links for authenticated vs guest users.
 * Responsive: hamburger menu on mobile.
 */
const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = isAuthenticated
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/analyze", label: "Analyze Resume" },
        { to: "/history", label: "History" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 20 20" width={18} height={18}>
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-display font-bold text-lg text-dark tracking-tight">
            Resume<span className="text-brand-600">ATS</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-dark"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          )}

          {!isAuthenticated && (
            <Link to="/signup" className="ml-2 btn-primary py-2 text-sm">
              Sign Up Free
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 fade-in">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="btn-primary mt-1 w-full justify-center text-sm"
              >
                Sign Up Free
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 text-left transition-colors"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
