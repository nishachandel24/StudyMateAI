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
    <aside className="min-w-0 rounded-3xl border border-white/10 bg-[#141821] p-5 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6">
      {/* Header */}
      <div className="mb-6 border-b border-white/8 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-lg text-violet-300 ring-1 ring-inset ring-violet-400/20">
              ✦
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                AI Study Assistant
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Generate notes, summarize content, or ask a question.
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
            Ready
          </span>
        </div>
      </div>

      {/* Generate Study Notes */}
      <section className="mb-6">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white">
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
            className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/40 focus:bg-white/8 focus:ring-4 focus:ring-violet-500/10"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto]">
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-200 outline-none transition focus:border-violet-400/40 focus:bg-white/8 focus:ring-4 focus:ring-violet-500/10"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button
              type="button"
              onClick={generateNotes}
              disabled={isLoading}
              className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
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
          <h3 className="text-sm font-semibold text-white">
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
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:border-violet-400/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="block text-sm font-semibold text-white">
              Summarize
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-400">
              Turn your note into a concise summary.
            </span>
          </button>
        </div>
      </section>

      {/* Ask AI */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white">
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
          className="min-h-[110px] w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/40 focus:bg-white/8 focus:ring-4 focus:ring-violet-500/10"
        />

        <button
          type="button"
          onClick={askAssistant}
          disabled={isLoading || !question.trim()}
          className="mt-3 w-full rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeAction === "assistant"
            ? "Thinking..."
            : "Ask AI"}
        </button>
      </section>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
        <p className="text-[11px] leading-4 text-slate-400">
          AI responses may need verification.
        </p>

        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="text-xs font-medium text-slate-400 transition hover:text-white disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}