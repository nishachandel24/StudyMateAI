import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page min-h-screen bg-[#0f1115] text-slate-100">

      <div className="flex min-h-screen">

        {/* =================================================
            LEFT PROMOTIONAL PANEL
        ================================================== */}
        <section className="app-surface-strong relative hidden w-1/2 overflow-hidden bg-[#11151d] lg:flex">

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                S
              </div>

              <div>
                <p className="font-bold text-white">
                  StudyMate
                </p>

                <p className="text-[10px] text-slate-500">
                  AI-powered learning
                </p>
              </div>
            </Link>


            {/* Main */}
            <div className="max-w-xl">

              <span className="inline-flex rounded-full border border-violet-400/15 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-200">
                AI-powered study workspace
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white xl:text-5xl">
                Study smarter.
                <br />
                Learn with confidence.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                Organize your notes, understand difficult concepts,
                and use AI to make your study sessions more effective.
              </p>


              {/* Features */}
              <div className="mt-8 space-y-4">

                {[
                  "Create and organize study notes",
                  "Generate and summarize content with AI",
                  "Get clearer explanations while learning",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs text-violet-200">
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
              Learn better. One note at a time.
            </p>

          </div>

        </section>


        {/* =================================================
            RIGHT AUTH PANEL
        ================================================== */}
        <main className="app-page flex min-h-screen w-full items-center justify-center bg-[#0f1115] px-5 py-10 sm:px-8 lg:w-1/2">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141821] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">

            {/* Mobile logo */}
            <div className="mb-10 lg:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                  S
                </div>

                <div>
                  <p className="font-bold text-white">
                    StudyMate
                  </p>

                  <p className="text-[10px] text-slate-500">
                    AI-powered learning
                  </p>
                </div>

              </Link>

            </div>


            {/* Heading */}
            <div>

              <span className="text-sm font-semibold text-violet-300">
                Welcome back
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Sign in to StudyMate
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Continue your learning journey and access your
                notes and AI study tools.
              </p>

            </div>


            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                <p className="text-sm font-medium leading-5 text-red-100">
                  {error}
                </p>

              </div>
            )}


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-200"
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
                  className="app-input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/40 focus:bg-white/8 focus:ring-4 focus:ring-violet-500/10"
                />

              </div>


              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="app-input w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/40 focus:bg-white/8 focus:ring-4 focus:ring-violet-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>


            {/* Signup */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">

              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-violet-300 transition hover:text-violet-200"
                >
                  Create one
                </Link>
              </p>

            </div>


            {/* Back */}
            <div className="mt-5 text-center">

              <Link
                to="/"
                className="text-xs font-medium text-slate-500 transition hover:text-white"
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

export default Login;