import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../utils/validators";
import FormInput from "../components/common/FormInput";
import Alert from "../components/common/Alert";
import Spinner from "../components/common/Spinner";

/**
 * SignupPage — new user registration.
 * Validates fields on blur and on submit.
 * On success, stores JWT and redirects to dashboard.
 */
const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
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
      const data = await registerUser(form.name.trim(), form.email.trim(), form.password);

      if (!data.success) {
        setApiError(data.message || "Registration failed. Please try again.");
        return;
      }

      // Store token in context (which also persists to localStorage)
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center fade-in">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-display font-bold text-dark mb-1.5">Create your account</h1>
            <p className="text-sm text-gray-500">Start analyzing resumes for free today</p>
          </div>

          {/* API error */}
          {apiError && (
            <div className="mb-5">
              <Alert type="error" message={apiError} onClose={() => setApiError("")} />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <FormInput
              label="Full Name"
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              required
              disabled={loading}
            />

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
              placeholder="Min 8 chars, uppercase, number, symbol"
              required
              disabled={loading}
            />

            {/* Password hint */}
            {!errors.password && (
              <p className="text-xs text-gray-400 -mt-3">
                Must include uppercase, lowercase, number &amp; special character.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-1"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="border-white" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
