import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../services/api";
import AIStudyPanel from "../components/AIStudyPanel";

function NoteContent({ content }) {
  return (
    <div className="max-w-none text-sm leading-7 text-slate-300">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-5 mt-1 text-2xl font-bold tracking-tight text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-7 border-b border-white/10 pb-2 text-lg font-bold text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-bold text-white">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-4 break-words text-slate-300 [overflow-wrap:anywhere]">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mb-5 list-disc space-y-2 pl-6 text-slate-300">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-5 list-decimal space-y-2 pl-6 text-slate-300">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="break-words [overflow-wrap:anywhere]">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-slate-200">{children}</em>
          ),

          code: ({ children }) => (
            <code className="break-all rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-xs text-violet-200 ring-1 ring-inset ring-white/10">
              {children}
            </code>
          ),

          pre: ({ children }) => (
            <pre className="mb-5 overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-6 text-slate-100 ring-1 ring-inset ring-white/10">
              {children}
            </pre>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-4 border-violet-400/40 bg-violet-500/10 px-4 py-3 text-slate-300">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-300 underline decoration-violet-400/30 underline-offset-2 hover:text-violet-200"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function NoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editorMode, setEditorMode] = useState("write");

  const [aiResult, setAiResult] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState("");
  const aiResponseRef = useRef(null);

  const characterCount = formData.content.length;

  useEffect(() => {
    if (aiResult || aiError || aiLoading) {
      aiResponseRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [aiResult, aiError, aiLoading]);

  const wordCount = useMemo(() => {
    if (!formData.content.trim()) return 0;

    return formData.content.trim().split(/\s+/).length;
  }, [formData.content]);

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    const fetchNote = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/notes/${id}`);

        const note = response.data?.note || response.data;

        setFormData({
          title: note?.title || "",
          content: note?.content || "",
        });
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Unable to load this note."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const title = formData.title.trim();
    const content = formData.content.trim();

    if (!title) {
      setError("Please enter a note title.");
      return;
    }

    if (!content) {
      setError("Please write some content before saving.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title,
        content,
      };

      if (isEditing) {
        await api.put(`/notes/${id}`, payload);
        setSuccess("Note updated successfully.");
      } else {
        const response = await api.post("/notes", payload);

        const createdNote =
          response.data?.note || response.data;

        const createdId =
          createdNote?._id || createdNote?.id;

        if (createdId) {
          navigate(`/notes/${createdId}`, {
            replace: true,
          });
          return;
        }

        setSuccess("Note created successfully.");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save the note."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAIResult = ({
    result,
    error: resultError,
    loading: resultLoading,
    action,
  }) => {
    setAiResult(result || "");
    setAiError(resultError || "");
    setAiLoading(Boolean(resultLoading));
    setAiAction(action || "");
  };

  const clearAIResponse = () => {
    setAiResult("");
    setAiError("");
    setAiLoading(false);
    setAiAction("");
  };

  if (loading) {
    return (
      <div className="app-page min-h-screen bg-[#0f1115] text-slate-100">
        <nav className="app-surface-strong border-b border-white/10 bg-[#11151d]">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              to="/dashboard"
              className="text-lg font-bold tracking-tight text-white"
            >
              StudyMate <span className="text-violet-300">AI</span>
            </Link>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="app-surface rounded-2xl border border-white/10 bg-[#141821] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
            <div className="animate-pulse space-y-5">
              <div className="h-7 w-48 rounded bg-white/10" />
              <div className="h-12 rounded-xl bg-white/5" />
              <div className="h-72 rounded-xl bg-white/5" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-page min-h-screen bg-[#0f1115] text-slate-100">
      {/* Navbar */}
      <nav className="app-surface-strong sticky top-0 z-40 border-b border-white/10 bg-[#11151d]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            className="text-lg font-bold tracking-tight text-white"
          >
            StudyMate <span className="text-violet-300">AI</span>
          </Link>

          <Link
            to="/dashboard"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200 ring-1 ring-inset ring-violet-400/15">
              {isEditing ? "Editing note" : "New note"}
            </span>

            <span className="text-xs text-slate-500">
              {wordCount} words
            </span>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {isEditing
                  ? "Continue learning."
                  : "Create a new note."}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Write your notes, preview them with formatting, and use
                AI to turn your content into useful study material.
              </p>
            </div>

            <button
              type="submit"
              form="note-form"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Note"
                  : "Save Note"}
            </button>
          </div>
        </div>

        {/* Messages */}
        {(error || success) && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-500/20 bg-red-500/10 text-red-100"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {error || success}
          </div>
        )}

        {/* Main Workspace */}
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Note Editor */}
          <section className="app-surface min-w-0 rounded-3xl border border-white/10 bg-[#141821] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Note Editor
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Use Markdown-style formatting for headings, lists,
                  bold text, code, and more.
                </p>
              </div>

              <div className="flex shrink-0 rounded-lg bg-white/5 p-1 ring-1 ring-inset ring-white/10">
                <button
                  type="button"
                  onClick={() => setEditorMode("write")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    editorMode === "write"
                      ? "bg-[#171c26] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Write
                </button>

                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    editorMode === "preview"
                      ? "bg-[#171c26] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            <form id="note-form" onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Note title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript Event Bubbling"
                  className="app-input w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/40 focus:bg-white/8 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              {/* Content */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Note content
                  </label>

                  <span className="text-xs text-slate-500">
                    {characterCount.toLocaleString()} characters
                  </span>
                </div>

                {editorMode === "write" ? (
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder={`Write your notes here...

Example:

# Event Bubbling

Event bubbling is a JavaScript event propagation mechanism.

## Key Points

- Event starts from the target element.
- It then moves upward through its parents.
- Event delegation uses this behavior.

**Important:** Use event.stopPropagation() when you need to stop bubbling.`}
                    rows={14}
                    className="app-input min-h-[360px] w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400/40 focus:bg-white/8 focus:ring-4 focus:ring-violet-500/10"
                  />
                ) : (
                  <div className="app-surface-strong h-[360px] overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-[#11151d] px-5 py-5">
                    {formData.content.trim() ? (
                      <NoteContent content={formData.content} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center">
                        <div>
                          <p className="text-sm font-medium text-slate-300">
                            Nothing to preview yet
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Start writing your note in Write mode.
                          </p>
                        </div>
                      </div>
                    )}
                 </div>
                )}
              </div>

              {/* Editor Footer */}
              <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-slate-500">
                  Changes are saved to your StudyMate account.
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/dashboard"
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : isEditing
                        ? "Update"
                        : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* AI Controls */}
          <AIStudyPanel
            title={formData.title}
            content={formData.content}
            onResult={handleAIResult}
            onClear={clearAIResponse}
          />
        </div>

        {/* AI Response */}
        {(aiResult || aiError || aiLoading) && (
          <section
            ref={aiResponseRef}
            className={`app-surface mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#141821] shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-all duration-300 ${
              aiResult || aiError ? "ring-2 ring-violet-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)]" : ""
            }`}
          >
            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-sm text-violet-200 ring-1 ring-inset ring-violet-400/15">
                    ✦
                  </span>

                  <h2 className="text-sm font-semibold text-white">
                    AI Response
                  </h2>
                </div>

                {aiAction && (
                  <p className="mt-1 text-xs text-slate-500">
                    {aiAction}
                  </p>
                )}
              </div>

              {aiResult && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(aiResult);
                      } catch (copyError) {
                        console.error(copyError);
                      }
                    }}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Copy
                  </button>

                  <button
                    type="button"
                    onClick={clearAIResponse}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {aiError ? (
              <div className="px-5 py-6 sm:px-6">
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {aiError}
                </div>
              </div>
            ) : aiLoading ? (
              <div className="px-5 py-8 sm:px-6">
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-violet-400/15 bg-violet-500/10 px-4 py-4">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-violet-300" />
                  <p className="text-sm font-medium text-violet-200">
                    AI is preparing your response...
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ) : (
              <div className="max-h-[650px] overflow-y-auto overflow-x-hidden px-5 py-6 sm:px-8">
                <div className="max-w-none text-sm leading-7 text-slate-300">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-5 text-2xl font-bold tracking-tight text-white">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="mb-3 mt-7 border-b border-white/10 pb-2 text-lg font-bold text-white">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="mb-2 mt-5 text-base font-bold text-white">
                          {children}
                        </h3>
                      ),

                      p: ({ children }) => (
                        <p className="mb-4 break-words text-slate-300 [overflow-wrap:anywhere]">
                          {children}
                        </p>
                      ),

                      ul: ({ children }) => (
                        <ul className="mb-5 list-disc space-y-2 pl-6 text-slate-300">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="mb-5 list-decimal space-y-2 pl-6 text-slate-300">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => (
                        <li className="break-words [overflow-wrap:anywhere]">
                          {children}
                        </li>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),

                      em: ({ children }) => (
                        <em className="text-slate-200">
                          {children}
                        </em>
                      ),

                      code: ({ children }) => (
                        <code className="break-all rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-xs text-violet-200 ring-1 ring-inset ring-white/10">
                          {children}
                        </code>
                      ),

                      pre: ({ children }) => (
                        <pre className="mb-5 overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-6 text-slate-100 ring-1 ring-inset ring-white/10">
                          {children}
                        </pre>
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="my-5 border-l-4 border-violet-400/40 bg-violet-500/10 px-4 py-3 text-slate-300">
                          {children}
                        </blockquote>
                      ),

                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-violet-300 underline decoration-violet-400/30 underline-offset-2 hover:text-violet-200"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {aiResult}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}