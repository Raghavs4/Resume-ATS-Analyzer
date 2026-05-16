import React from "react";
import Navbar from "./Navbar";

/**
 * Layout — wraps all pages with Navbar + content area + footer.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-100 bg-white py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ResumeATS — AI-Powered ATS Analyzer &nbsp;|&nbsp; Final Year Project
      </footer>
    </div>
  );
};

export default Layout;
