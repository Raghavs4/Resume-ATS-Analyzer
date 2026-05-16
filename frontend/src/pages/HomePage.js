import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * HomePage — public landing page.
 * Explains the product and prompts user to sign up or log in.
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Instant ATS Score",
      desc: "Get a score out of 100 showing how well your resume passes Applicant Tracking Systems.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "AI-Powered Feedback",
      desc: "Powered by Google Gemini — get detailed, actionable suggestions to improve your resume.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      title: "PDF & DOCX Support",
      desc: "Upload your resume in PDF or Word format. We extract and analyze the content automatically.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Analysis History",
      desc: "Access all your past analyses in one place and track your resume improvement over time.",
    },
  ];

  return (
    <div className="fade-in">
      {/* Hero section */}
      <section className="text-center py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-brand-100">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          Powered by Google Gemini AI
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-dark leading-tight mb-6">
          Beat the ATS.<br />
          <span className="text-brand-600">Land the Interview.</span>
        </h1>

        <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your resume, paste a job description, and instantly get an ATS compatibility
          score with AI-generated feedback to help you get noticed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <Link to="/analyze" className="btn-primary px-8 py-3.5 text-base">
              Analyze My Resume
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary px-8 py-3.5 text-base">
                Get Started — It's Free
              </Link>
              <Link to="/login" className="btn-outline px-8 py-3.5 text-base">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-12">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-center text-dark mb-10">
          Why use ResumeATS?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-dark mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mt-12 bg-brand-600 rounded-2xl p-8 sm:p-12 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
          Ready to optimize your resume?
        </h2>
        <p className="text-brand-100 mb-7 text-sm sm:text-base">
          Join thousands of job seekers who improved their ATS scores.
        </p>
        {isAuthenticated ? (
          <Link to="/analyze" className="inline-block bg-white text-brand-700 font-semibold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors">
            Analyze Now
          </Link>
        ) : (
          <Link to="/signup" className="inline-block bg-white text-brand-700 font-semibold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors">
            Create Free Account
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
