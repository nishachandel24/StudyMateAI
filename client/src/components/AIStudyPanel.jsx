import { useState } from "react";
import api from "../services/api";

export default function AIStudyPanel({
  title,
  content,
  onResult,
  onClear,
}) {
  const [activeAction, setActiveAction] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [question, setQuestion] = useState("");

  const extractResult = (data) => {
    return (
      data?.result ||
      data?.text ||
      data?.response ||
      data?.feedback ||
      data?.summary ||
      data?.notes ||
      ""
    );
  };

  const runAI = async (action, request, actionLabel) => {
    setActiveAction(action);

    onResult({
      result: "",
      error: "",
      loading: true,
      action: actionLabel,
    });

    try {
      const response = await request();

      const result = extractResult(response.data);

      if (!result) {
        throw new Error(
          "The AI returned an empty response."
        );
      }

      onResult({
        result,
        error: "",
        loading: false,
        action: actionLabel,
      });
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong while contacting the AI.";

      onResult({
        result: "",
        error: message,
        loading: false,
        action: actionLabel,
      });
    } finally {
      setActiveAction("");
    }
  };

  const generateNotes = async () => {
    const selectedTopic = topic.trim() || title.trim();

    if (!selectedTopic) {
      onResult({
        result: "",
        error: "Please enter a topic for AI to generate notes.",
        loading: false,
        action: "",
      });

      return;
    }

    await runAI(
      "generate-notes",
      () =>
        api.post("/ai/generate-notes", {
          topic: selectedTopic,
          level,
        }),
      "Generated Study Notes"
    );
  };

  const summarizeNote = async () => {
    if (!content.trim()) {
      onResult({
        result: "",
        error: "Write some note content before asking AI to summarize it.",
        loading: false,
        action: "",
      });

      return;
    }

    await runAI(
      "summarize",
      () =>
        api.post("/ai/summarize", {
          content,
        }),
      "Note Summary"
    );
  };

  const getFeedback = async () => {
    if (!content.trim()) {
      onResult({
        result: "",
        error: "Write some note content before requesting feedback.",
        loading: false,
        action: "",
      });

      return;
    }

    await runAI(
      "feedback",
      () =>
        api.post("/ai/feedback", {
          content,
        }),
      "AI Feedback"
    );
  };

  const askAssistant = async () => {
    if (!question.trim()) {
      onResult({
        result: "",
        error: "Please enter a question.",
        loading: false,
        action: "",
      });

      return;
    }

    await runAI(
      "assistant",
      () =>
        api.post("/ai/assistant", {
          question: question.trim(),
          noteContent: content,
        }),
      "AI Assistant"
    );
  };

  const handleClear = () => {
    setTopic("");
    setQuestion("");
    setActiveAction("");

    onClear?.();
  };

  const isLoading = Boolean(activeAction);

  return (
    <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 border-b border-slate-100 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
              ✦
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                AI Study Assistant
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Use AI to understand, improve, and study your notes.
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
            Ready
          </span>
        </div>
      </div>

      {/* Generate Study Notes */}
      <section className="mb-6">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Generate Study Notes
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Give AI a topic and difficulty level.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder={
              title
                ? `Using "${title}" or enter another topic`
                : "e.g. JavaScript Event Bubbling"
            }
            className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto]">
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button
              type="button"
              onClick={generateNotes}
              disabled={isLoading}
              className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeAction === "generate-notes"
                ? "Generating..."
                : "Generate"}
            </button>
          </div>
        </div>
      </section>

      {/* Quick AI Tools */}
      <section className="mb-6">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Quick AI Tools
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Work directly with your current note.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <button
            type="button"
            onClick={summarizeNote}
            disabled={isLoading || !content.trim()}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="block text-sm font-semibold text-slate-800">
              Summarize
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-400">
              Turn your note into a concise summary.
            </span>
          </button>

          <button
            type="button"
            onClick={getFeedback}
            disabled={isLoading || !content.trim()}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="block text-sm font-semibold text-slate-800">
              Get Feedback
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-400">
              Get suggestions to improve your notes.
            </span>
          </button>
        </div>
      </section>

      {/* Ask AI */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Ask AI
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Ask questions using your current note as context.
          </p>
        </div>

        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. Explain event bubbling with a simple example."
          rows={4}
          className="min-h-[110px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
        />

        <button
          type="button"
          onClick={askAssistant}
          disabled={isLoading || !question.trim()}
          className="mt-3 w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeAction === "assistant"
            ? "Thinking..."
            : "Ask AI"}
        </button>
      </section>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-[11px] leading-4 text-slate-400">
          AI responses may need verification.
        </p>

        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="text-xs font-medium text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}