import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="app-page min-h-screen bg-[#0f1115] text-slate-100">
      {/* =========================
          NAVBAR
      ========================== */}
      <nav className="app-surface-strong sticky top-0 z-50 border-b border-white/10 bg-[#11151d]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
              S
            </div>

            <span className="text-base font-bold tracking-tight text-white sm:text-lg">
              StudyMate{" "}
              <span className="text-violet-300">AI</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0f1115]">
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
          {/* Hero Content */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
              AI-powered study workspace
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Turn your notes into{" "}
              <span className="text-violet-300">
                smarter learning.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              StudyMate AI helps you create organized notes,
              understand difficult topics, summarize content, and
              learn faster with AI-powered study tools.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
              >
                Create Your Account
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Create notes. Ask AI. Understand better.
            </p>
          </div>

          {/* Hero Product Preview */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-violet-500/10 blur-2xl" />

            <div className="app-surface relative overflow-hidden rounded-2xl border border-white/10 bg-[#141821] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-xs font-bold text-white">
                    S
                  </div>

                  <span className="text-xs font-semibold text-slate-200">
                    StudyMate AI
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Preview Body */}
              <div className="grid gap-0 sm:grid-cols-[1fr_170px]">
                {/* Notes */}
                <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r sm:border-white/10">
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                      My Note
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-white">
                      JavaScript Events
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2.5 w-4/5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-full rounded-full bg-white/10" />
                    <div className="h-2.5 w-11/12 rounded-full bg-white/10" />
                    <div className="h-2.5 w-3/4 rounded-full bg-white/10" />
                  </div>

                  <div className="mt-6 rounded-xl border border-violet-400/15 bg-violet-500/10 p-4">
                    <p className="text-xs font-semibold text-violet-200">
                      Key Concept
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                      Event bubbling allows an event to move from
                      the target element toward its parent elements.
                    </p>
                  </div>
                </div>

                {/* AI Panel */}
                <div className="bg-white/5 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-200">
                      AI Assistant
                    </p>

                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-400/15">
                      Ready
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-lg border border-white/10 bg-[#11151d] px-3 py-2 text-[10px] text-slate-400">
                      Summarize my note
                    </div>

                    <div className="rounded-lg border border-white/10 bg-[#11151d] px-3 py-2 text-[10px] text-slate-400">
                      Explain this simply
                    </div>

                    <div className="rounded-lg border border-violet-400/15 bg-violet-500/10 px-3 py-2 text-[10px] font-medium text-violet-200">
                      Ask AI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section className="bg-[#0f1115] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
              Why StudyMate AI
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need for smarter study sessions.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Keep your study material organized and use AI when
              you need help understanding it.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-violet-400/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-400/15">
                ✎
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                Create Notes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create and organize your study material in one
                focused workspace.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-violet-400/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-400/15">
                ✦
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                AI Assistance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Ask questions, generate explanations, and get help
                with difficult concepts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-violet-400/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-400/15">
                ≡
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                Smart Summaries
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Convert long notes into concise summaries that are
                easier to revise.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-violet-400/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-400/15">
                ✓
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                Improve Your Notes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Use AI to make your study material clearer and more
                useful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section className="relative overflow-hidden bg-[#11151d] py-20 sm:py-24">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          {/* Left */}
          <div>
            <span className="inline-flex rounded-full border border-violet-400/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200">
              How it works
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From notes to understanding in a few steps.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              StudyMate AI keeps the workflow simple so you can
              spend less time managing your study material and more
              time learning.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:border-violet-400/20 sm:p-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-200 ring-1 ring-inset ring-violet-400/15">
                  1
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white sm:text-base">
                    Create your notes
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                    Write and organize your study material in your
                    personal workspace.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:border-violet-400/20 sm:p-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-200 ring-1 ring-inset ring-violet-400/15">
                  2
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white sm:text-base">
                    Ask StudyMate AI
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                    Generate explanations, summaries, or ask
                    questions about your notes.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:border-violet-400/20 sm:p-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-sm font-bold text-violet-200 ring-1 ring-inset ring-violet-400/15">
                  3
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white sm:text-base">
                    Revise with clarity
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                    Use concise explanations to strengthen your
                    understanding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="app-surface relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#141821] py-20 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
          {/* Subtle decorative shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <span className="inline-flex rounded-full border border-violet-400/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200">
              Start learning smarter
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to study smarter?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Create your workspace and start turning your notes
              into a more effective learning experience.
            </p>

            <Link
              to="/signup"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="app-surface-strong border-t border-white/10 bg-[#0f1115]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold text-white">
              StudyMate AI
            </p>

            <p className="mt-1 text-xs text-slate-500">
              A focused AI-powered study workspace.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Built with React, Node.js, MongoDB and Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}