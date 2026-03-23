import express from "express";
import { geminiChat } from "../services/geminiService.js";
import { logChat } from "../services/chatLogs.js";
import { faqFallback } from "../faq.js";
// import { faqFallback } from "../services/faqService.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Middleware to assign session ID
router.use((req, res, next) => {
  req.userId = req.headers["x-user-id"] || uuidv4();
  next();
});

router.post("/", async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  if (!message) {
    return res.status(400).json({
      reply: "Message is required.",
      userId,
    });
  }

  // Log user message
  logChat(userId, "user", message);

  let reply = "";
  let source = "faq";

  try {
    reply = await geminiChat(message); // Gemini + RAG
    source = "gemini";
    // Log bot response
    logChat(userId, "Smart_bot", reply);
  } catch (err) {
    logChat("smart_AI_error", "[Gemini Error → Fallback]", err.message);
    logChat(
      userId,
      "[smart_AI_error detected]",
      "*** Using Local A.I, less smarter, check 'smart_AI_error.txt' for error details ***",
    );
    reply = faqFallback(message);
    // Log bot response
    logChat(userId, "Local_bot", reply);
  }

  res.json({ reply, userId, source });
});

export default router;
