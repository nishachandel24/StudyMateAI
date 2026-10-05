import express from "express";

import {
  generateStudyNotes,
  summarizeNote,
  getAIFeedback,
  askAIAssistant,
} from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Every AI feature requires authentication
router.use(authMiddleware);

router.post("/generate-notes", generateStudyNotes);

router.post("/summarize", summarizeNote);

router.post("/feedback", getAIFeedback);

router.post("/assistant", askAIAssistant);

export default router;