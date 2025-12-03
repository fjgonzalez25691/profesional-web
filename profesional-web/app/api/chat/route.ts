import { CHATBOT_SYSTEM_PROMPT } from "@/prompts/chatbot-system";
import { getGroqClient } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rate-limit";
import { logChatMessage } from "@/lib/chat-logger";
import { validateResponse } from "@/lib/response-validator";

const TIMEOUT_MS = process.env.NODE_ENV === "test" ? 200 : 8000;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

async function getBody(req: Request) {
  try {
    return await req.json();
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function getIp(req: Request) {
  const header = req.headers.get("x-forwarded-for");
  if (header) return header.split(",")[0].trim();
  // @ts-expect-error: next runtime adds ip
  return req.ip || "unknown";
}

export async function POST(req: Request) {
  let cachedSessionId = "unknown";
  let cachedUserMessage = "";

  try {
    const { messages, sessionId } = await getBody(req);
    cachedSessionId = sessionId || "unknown";
    const ip = getIp(req);

    const rate = await checkRateLimit(ip);
    if (!rate.ok) {
      return Response.json(
        { error: "Rate limit exceeded. Try again in 1 hour." },
        { status: 429 },
      );
    }

    const groq = getGroqClient();
    const userMessage: string = messages?.[messages.length - 1]?.content || "";
    cachedUserMessage = userMessage;
    const startTime = Date.now();
    let hasError = false;

    const completion = await Promise.race([
      groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: CHATBOT_SYSTEM_PROMPT },
          ...(Array.isArray(messages) ? messages : []),
        ] as ChatMessage[],
        temperature: 0.7,
        max_tokens: 500,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS),
      ),
    ]).catch((error) => {
      hasError = true;
      throw error;
    });

    const botResponse = completion.choices[0].message.content ?? "";
    const validated = validateResponse(botResponse);

    await logChatMessage({
      sessionId: cachedSessionId,
      ip,
      userMessage,
      botMessage: validated.text,
      responseTimeMs: Date.now() - startTime,
      modelUsed: "llama-3.3-70b-versatile",
      error: hasError,
    });

    return Response.json({ message: validated.text });
  } catch (error: unknown) {
    const message =
      "Disculpa, estoy tardando más de lo esperado. Reintenta en unos segundos o agenda una sesión de 30 minutos para revisarlo juntos.";

    if (error instanceof Error && error.message === "Timeout") {
      await logChatMessage({
        sessionId: cachedSessionId,
        ip: getIp(req),
        userMessage: cachedUserMessage,
        botMessage: message,
        responseTimeMs: TIMEOUT_MS,
        modelUsed: "llama-3.3-70b-versatile",
        error: true,
      });
      return Response.json({ message });
    }

    console.error("Chat API error", error);
    await logChatMessage({
      sessionId: cachedSessionId,
      ip: getIp(req),
      userMessage: cachedUserMessage,
      botMessage: message,
      responseTimeMs: Date.now() - Date.now(), // 0 for unexpected errors
      modelUsed: "llama-3.3-70b-versatile",
      error: true,
    });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
