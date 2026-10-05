import { generateAIResponse } from "../utils/gemini.js";


// ==========================================
// GENERATE STUDY NOTES
// ==========================================

export const generateStudyNotes = async (req, res) => {
  try {
    const { topic, level } = req.body;

    // Required field
    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    // Input length validation
    if (topic.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Topic cannot exceed 200 characters",
      });
    }

    const selectedLevel = level?.trim() || "beginner";

    const prompt = `
You are an educational AI assistant.

Generate clear and useful study notes about:

Topic: ${topic.trim()}
Student Level: ${selectedLevel}

Requirements:
- Start with a short definition.
- Explain the important concepts.
- Use simple language.
- Use headings and bullet points.
- Include practical examples where useful.
- Include important points to remember.
- End with 3 short revision questions.
- Do not add unnecessary information.
- Format the response using Markdown.

The response should help a student understand and revise the topic.
`;

    const result = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      message: "Study notes generated successfully",
      result,
    });
  } catch (error) {
    console.error("Generate study notes error:", error);

    // Temporary Gemini service problem
    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "The AI service is temporarily busy. Please try again in a few seconds.",
      });
    }

    // Gemini rate limit
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI usage limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to generate study notes",
    });
  }
};


// ==========================================
// SUMMARIZE NOTE
// ==========================================

export const summarizeNote = async (req, res) => {
  try {
    const { content } = req.body;

    // Required field
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    // Input length validation
    if (content.trim().length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Note content cannot exceed 20,000 characters",
      });
    }

    const prompt = `
You are a study assistant.

Summarize the following study note.

Requirements:
- Keep the important information.
- Remove repetition and unnecessary details.
- Use clear and simple language.
- Use headings and bullet points where appropriate.
- Keep the summary significantly shorter than the original.
- Do not introduce facts that are not present in the note.
- Format the response using Markdown.

STUDY NOTE:
${content.trim()}
`;

    const result = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      message: "Note summarized successfully",
      result,
    });
  } catch (error) {
    console.error("Summarize note error:", error);

    // Temporary Gemini service problem
    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "The AI service is temporarily busy. Please try again in a few seconds.",
      });
    }

    // Gemini rate limit
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI usage limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to summarize the note",
    });
  }
};


// ==========================================
// AI FEEDBACK
// ==========================================

export const getAIFeedback = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Required field
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    // Input length validation
    if (content.trim().length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Note content cannot exceed 20,000 characters",
      });
    }

    const prompt = `
You are an AI study mentor.

Review the student's study note.

Title:
${title?.trim() || "Untitled Note"}

Content:
${content.trim()}

Provide useful educational feedback.

Analyze:
1. Clarity
2. Organization
3. Completeness
4. Accuracy based only on the provided content
5. Areas that could be improved
6. Specific suggestions for making the note easier to study

Also provide:
- What was done well
- What should be improved
- 3 actionable suggestions

Do not rewrite the entire note.
Do not be unnecessarily critical.
Use clear Markdown formatting.
`;

    const result = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      message: "AI feedback generated successfully",
      result,
    });
  } catch (error) {
    console.error("AI feedback error:", error);

    // Temporary Gemini service problem
    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "The AI service is temporarily busy. Please try again in a few seconds.",
      });
    }

    // Gemini rate limit
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI usage limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to generate AI feedback",
    });
  }
};


// ==========================================
// AI ASSISTANT
// ==========================================

export const askAIAssistant = async (req, res) => {
  try {
    const { question, noteContent } = req.body;

    // Required field
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Question length validation
    if (question.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Question cannot exceed 3,000 characters",
      });
    }

    // Note content length validation
    if (noteContent && noteContent.trim().length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Note content cannot exceed 20,000 characters",
      });
    }

    const context = noteContent?.trim()
      ? `
The student is currently working with this note:

${noteContent.trim()}
`
      : `
There is no specific note context.
`;

    const prompt = `
You are StudyMate AI, a helpful study assistant.

${context}

Student's question:
${question.trim()}

Instructions:
- Answer the student's question clearly.
- Explain concepts step by step when necessary.
- Prefer simple language.
- Use examples when they help.
- If the question relates to the provided note, use that context.
- If the answer cannot be determined from the note, say so rather than pretending the note contains the answer.
- Do not unnecessarily repeat the entire note.
- Format the response using Markdown.
`;

    const result = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      result,
    });
  } catch (error) {
    console.error("AI assistant error:", error);

    // Temporary Gemini service problem
    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "The AI service is temporarily busy. Please try again in a few seconds.",
      });
    }

    // Gemini rate limit
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI usage limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to get AI assistant response",
    });
  }
};