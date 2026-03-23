import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const client = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

async function listModels() {
  try {
    const response = await client.models.list(); // ✅ correct method
    console.log("Available Models:");
    response.models.forEach((m) => {
      console.log(`- ${m.name} (${m.displayName})`);
      console.log(
        `  Supported generate methods: ${m.supportedGenerationMethods.join(", ")}\n`,
      );
    });
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listModels();
