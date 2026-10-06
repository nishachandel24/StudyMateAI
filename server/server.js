import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const startServer = async () => {
  try {
    await connectDB();


    app.listen(PORT, "0.0.0.0",() => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
