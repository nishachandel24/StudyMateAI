import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const firstName = user?.name?.split(" ")[0] || "Student";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notes");

      setNotes(response.data.notes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/notes/${id}`);

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete note:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete the note."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";

      return (
        title.includes(query) ||
        content.includes(query)
      );
    });
  }, [notes, search]);

  const recentNotesCount = useMemo(() => {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
       sevenDaysAgo.getDate() - 7
    );

    return notes.filter((note) => {
       if (!note.updatedAt) return false;

       return new Date(note.updatedAt) >= sevenDaysAgo;
    }).length;
  }, [notes]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPreview = (content) => {
    if (!content) {
      return "No content available.";
    }

    return content.replace(/\s+/g, " ").trim();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              S
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight text-slate-900">
                StudyMate
              </p>

              <p className="hidden text-[10px] font-medium text-slate-500 sm:block">
                AI-powered learning
              </p>
            </div>
          </Link>

          {/* User */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "Student"}
              </p>

              <p className="text-xs text-slate-500">
                Student
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:px-3 sm:text-sm"
            >
              Logout
            </button>

          </div>
        </div>
      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            WELCOME SECTION
        ================================================== */}
        <section className="mb-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div className="min-w-0">

              <p className="mb-2 text-sm font-medium text-indigo-600">
                Your learning workspace
              </p>

              <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back, {firstName}.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Organize your notes, review what you have learned,
                and use AI to study more effectively.
              </p>

            </div>

            <Link
              to="/notes/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              <span className="text-lg leading-none">
                +
              </span>

              New Note
            </Link>

          </div>
        </section>


        {/* =================================================
            STATS
        ================================================== */}
        <section className="mb-10 grid min-w-0 gap-4 sm:grid-cols-3">

          {/* Total Notes */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm font-medium text-slate-500">
                  Total Notes
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {notes.length}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  Notes in your workspace
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                📝
              </div>

            </div>
          </div>


          {/* Recent Notes */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm font-medium text-slate-500">
                  Recent Notes
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                   {recentNotesCount}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                   Updated in the last 7 days
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg">
                ✨
              </div>

            </div>
          </div>


          {/* AI Tools */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm font-medium text-slate-500">
                  AI Study Tools
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  4
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  Tools available for learning
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-600">
                AI
              </div>

            </div>
          </div>

        </section>


        {/* =================================================
            NOTES HEADER
        ================================================== */}
        <section className="min-w-0">

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="min-w-0">

              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Your Notes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your study material organized in one place.
              </p>

            </div>


            {/* Search */}
            <div className="relative w-full shrink-0 sm:w-72">

              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search notes..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="min-w-0 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="mb-4 h-5 w-2/3 rounded bg-slate-200" />

                  <div className="mb-2 h-3 w-full rounded bg-slate-100" />

                  <div className="mb-2 h-3 w-5/6 rounded bg-slate-100" />

                  <div className="mt-6 h-3 w-1/3 rounded bg-slate-100" />
                </div>
              ))}

            </div>
          )}


          {/* =================================================
              ERROR
          ================================================== */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

              <p className="font-semibold text-red-800">
                Unable to load notes
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={fetchNotes}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}


          {/* =================================================
              NO SEARCH RESULTS
          ================================================== */}
          {!loading &&
            !error &&
            notes.length > 0 &&
            filteredNotes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  🔎
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  No notes found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try searching with a different title or keyword.
                </p>

              </div>
            )}


          {/* =================================================
              EMPTY STATE
          ================================================== */}
          {!loading &&
            !error &&
            notes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                  📝
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Start your first note
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create your first study note and use StudyMate AI
                  to summarize it, generate feedback, or ask questions.
                </p>

                <Link
                  to="/notes/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <span className="text-lg leading-none">
                    +
                  </span>

                  Create Your First Note
                </Link>

              </div>
            )}


          {/* =================================================
              NOTES GRID
          ================================================== */}
          {!loading &&
            !error &&
            filteredNotes.length > 0 && (
              <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredNotes.map((note) => (
                  <article
                    key={note._id}
                    className="group flex min-h-[240px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6"
                  >

                    {/* Card Header */}
                    <div className="flex min-w-0 items-start justify-between gap-3">

                      <div className="min-w-0 flex-1">

                        <h3
                          title={note.title}
                          className="truncate text-base font-bold text-slate-900"
                        >
                          {note.title}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          Updated {formatDate(note.updatedAt)}
                        </p>

                      </div>

                      <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                        Note
                      </span>

                    </div>


                    {/* Card Content */}
                    <div className="mt-5 min-w-0 flex-1 overflow-hidden">

                      <p
                        title={getPreview(note.content)}
                        className="break-words text-sm leading-6 text-slate-500 line-clamp-4"
                        style={{
                           overflowWrap: "anywhere",
                           wordBreak: "break-word",
                        }}
                       >
                        {getPreview(note.content)}
                      </p>

                    </div>


                    {/* Card Footer */}
                    <div className="mt-5 flex min-w-0 items-center justify-between gap-3 border-t border-slate-100 pt-4">

                      <Link
                        to={`/notes/${note._id}`}
                        className="min-w-0 truncate text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                      >
                        Open note →
                      </Link>

                      <button
                        onClick={() => handleDelete(note._id)}
                        disabled={deletingId === note._id}
                        className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === note._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </article>
                ))}

              </div>
            )}

        </section>

      </main>
    </div>
  );
};

export default Dashboard;