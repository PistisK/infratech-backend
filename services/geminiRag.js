export async function askGeminiWithRAG(userMessage) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key missing");
  }

  // If vector search / embeddings fail → throw
  const context = await getRagContext(userMessage);
  if (!context) {
    throw new Error("RAG context unavailable");
  }

  // Gemini request (simplified)
  const response = await gemini.generateContent({
    model: "gemini-2.5-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: context + "\n\nUser: " + userMessage }],
      },
    ],
  });

  if (!response?.text()) {
    throw new Error("Empty Gemini response");
  }

  return response.text();
}
