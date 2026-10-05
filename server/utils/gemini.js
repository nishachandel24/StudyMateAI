import getGeminiClient from "../config/gemini.js";

const PRIMARY_MODEL = "gemini-3.6-flash";
const FALLBACK_MODEL = "gemini-3.5-flash-lite";

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const isTemporaryError = (error) => {
  return (
    error?.status === 503 ||
    error?.status === 429 ||
    error?.status === 500 ||
    error?.status === 502 ||
    error?.status === 504
  );
};

const generateWithModel = async (ai, model, prompt) => {
  console.log(`Trying Gemini model: ${model}`);

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text.trim();
};

export const generateAIResponse = async (prompt) => {
  const ai = getGeminiClient();

  // Try primary model
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(
        `Gemini primary attempt ${attempt}: ${PRIMARY_MODEL}`
      );

      const result = await generateWithModel(
        ai,
        PRIMARY_MODEL,
        prompt
      );

      console.log("Primary Gemini model succeeded");

      return result;
    } catch (error) {
      console.error(
        `Primary model attempt ${attempt} failed:`,
        error.message
      );

      // Do not retry permanent errors
      if (!isTemporaryError(error)) {
        throw error;
      }

      // Wait before retrying
      if (attempt === 1) {
        console.log("Temporary error. Retrying in 2 seconds...");
        await sleep(2000);
      }
    }
  }

  // Fallback model
  try {
    console.log(
      `Primary model unavailable. Trying fallback: ${FALLBACK_MODEL}`
    );

    const result = await generateWithModel(
      ai,
      FALLBACK_MODEL,
      prompt
    );

    console.log("Fallback Gemini model succeeded");

    return result;
  } catch (error) {
    console.error(
      "Fallback Gemini model failed:",
      error.message
    );

    throw error;
  }
};