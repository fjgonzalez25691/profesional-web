import Groq from "groq-sdk";

let groqClient: Groq | null = null;

export function getGroqClient() {
  if (groqClient) return groqClient;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined");
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
}
