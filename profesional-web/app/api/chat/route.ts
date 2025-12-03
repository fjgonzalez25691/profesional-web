import { CHATBOT_SYSTEM_PROMPT } from "@/prompts/chatbot-system";
import { getGroqClient } from "@/lib/groq";
import { checkRateLimit } from "@/lib/rate-limit";
import { logChatMessage } from "@/lib/chat-logger";

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
  try {
    const { messages } = await getBody(req);
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
    ]);

    const botResponse = completion.choices[0].message.content ?? "";

    await logChatMessage(ip, userMessage, botResponse);

    return Response.json({ message: botResponse });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Timeout") {
      return Response.json({
        message: "Disculpa, error técnico. Puedes agendar una consulta directa.",
      });
    }

    console.error("Chat API error", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
