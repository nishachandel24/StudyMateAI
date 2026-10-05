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
                  "Get personalized feedback while learning",
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
              Learn better. One note at a time.
            </p>

          </div>

        </section>


        {/* =================================================
            RIGHT AUTH PANEL
        ================================================== */}
        <main className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
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
                Welcome back
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to StudyMate
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Continue your learning journey and access your
                notes and AI study tools.
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

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-800"
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

              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>


            {/* Signup */}
            <div className="mt-7 border-t border-slate-100 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Create one
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

export default Login;