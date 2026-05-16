import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { validateEmail, validateRequired } from "../utils/validators";
import FormInput from "../components/common/FormInput";
import Alert from "../components/common/Alert";
import Spinner from "../components/common/Spinner";

/**
 * LoginPage — existing user login.
 * After successful login, redirects to the originally requested page
 * (stored in location.state.from) or /dashboard as fallback.
 */
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the page the user tried to visit before being
  // redirected here by ProtectedRoute
  const from = location.state?.from?.pathname || "/dashboard";

  // ── Form state ──────────────────────────────────────────
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {
      email: validateEmail(form.email),
      password: validateRequired(form.password, "Password"),
    };
    setErrors(errs);
    return Object.values(errs).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginUser(form.email.trim(), form.password);

      if (!data.success) {
        setApiError(data.message || "Login failed. Please check your credentials.");
        return;
      }

      login(data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center fade-in">
      <div className="w-full max-w-md">
        <div className="card p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-display font-bold text-dark mb-1.5">Welcome back</h1>
            <p className="text-sm text-gray-500">Sign in to your ResumeATS account</p>
          </div>

          {/* Redirect notice */}
          {location.state?.from && (
            <div className="mb-5">
              <Alert type="info" message="Please login to access that page." />
            </div>
          )}

          {/* API error */}
          {apiError && (
            <div className="mb-5">
              <Alert type="error" message={apiError} onClose={() => setApiError("")} />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
              required
              disabled={loading}
            />

            <FormInput
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Your password"
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-1"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="border-white" />
                  Logging in…
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-600 font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
