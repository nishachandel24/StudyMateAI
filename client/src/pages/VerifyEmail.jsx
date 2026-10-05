import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.get("/auth/verify-email", {
          params: { token },
        });

        setStatus("success");
        setMessage(response.data?.message || "Your email has been verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Unable to verify your email.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
          S
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {status === "success" ? "Email Verified" : status === "error" ? "Verification Failed" : "Verifying Your Email"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Go to login
          </button>

          <Link
            to="/"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
