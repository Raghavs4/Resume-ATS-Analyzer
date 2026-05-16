import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ── Context ────────────────────────────────────────────────
import { AuthProvider, useAuth } from "./context/AuthContext";

// ── Layout ─────────────────────────────────────────────────
import Layout from "./components/layout/Layout";

// ── Guard ──────────────────────────────────────────────────
import ProtectedRoute from "./components/common/ProtectedRoute";

// ── Pages ──────────────────────────────────────────────────
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyzePage from "./pages/AnalyzePage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * AppRoutes — separated so it can access AuthContext via useAuth.
 * Redirects authenticated users away from /login and /signup.
 */
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Routes>
        {/* ── Public routes ─────────────────────────────── */}
        <Route path="/" element={<HomePage />} />

        {/* Redirect already-authenticated users away from auth pages */}
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* ── Protected routes ──────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <AnalyzePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:id"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* ── 404 ────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

/**
 * App — root component.
 * Wraps everything in AuthProvider and Router.
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
