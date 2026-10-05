import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // Basic validation
    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    // Password length
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Do NOT send confirmPassword to backend
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Signup failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* =================================================
            LEFT PROMOTIONAL PANEL
        ================================================== */}
        <section className="relative hidden w-1/2 overflow-hidden bg-slate-950 lg:flex">

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                S
              </div>

              <div>
                <p className="font-bold text-white">
                  StudyMate
                </p>

                <p className="text-[10px] text-slate-400">
                  AI-powered learning
                </p>
              </div>
            </Link>


            {/* Main */}
            <div className="max-w-xl">

              <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                Start learning smarter
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white xl:text-5xl">
                Your notes.
                <br />
                Your learning.
                <br />
                One workspace.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                Create an account and bring your study material
                together with practical AI-powered learning tools.
              </p>

              <div className="mt-8 space-y-4">

                {[
                  "Organize your study notes",
                  "Generate and summarize learning material",
                  "Ask AI questions about your notes",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs text-indigo-300">
                      ✓
                    </div>

                    <span className="text-sm text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}

              </div>

            </div>


            {/* Footer */}
            <p className="text-xs text-slate-500">
              Build better study habits with StudyMate AI.
            </p>

          </div>

        </section>


        {/* =================================================
            RIGHT FORM
        ================================================== */}
        <main className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                  S
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    StudyMate
                  </p>

                  <p className="text-[10px] text-slate-400">
                    AI-powered learning
                  </p>
                </div>
              </Link>

            </div>


            {/* Heading */}
            <div>

              <span className="text-sm font-semibold text-indigo-600">
                Get started
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your StudyMate account and start building
                a smarter study workflow.
              </p>

            </div>


            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium leading-5 text-red-700">
                  {error}
                </p>
              </div>
            )}


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {/* Name */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />

              </div>


              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />

              </div>


              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Use at least 8 characters with uppercase,
                  lowercase, number, and special character.
                </p>

              </div>


              {/* Confirm Password */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Confirm password
                </label>

                <div className="relative">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                      formData.confirmPassword &&
                      formData.password !==
                        formData.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                        : formData.confirmPassword &&
                          formData.password ===
                            formData.confirmPassword
                        ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-50"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>

                </div>

                {/* Password match indicator */}
                {formData.confirmPassword && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      formData.password ===
                      formData.confirmPassword
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formData.password ===
                    formData.confirmPassword
                      ? "Passwords match."
                      : "Passwords do not match."}
                  </p>
                )}

              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>

            </form>


            {/* Login */}
            <div className="mt-7 border-t border-slate-100 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>

            </div>


            {/* Back */}
            <div className="mt-5 text-center">

              <Link
                to="/"
                className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
              >
                ← Back to homepage
              </Link>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Signup;