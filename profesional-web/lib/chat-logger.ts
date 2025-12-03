import { getNeonClient } from "@/lib/db";

function anonymizeIp(ip: string) {
  if (!ip) return "unknown";
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      parts[2] = "0";
      parts[3] = "0";
      return parts.join(".");
    }
  }
  return ip;
}

export async function logChatMessage(params: {
  sessionId: string;
  ip: string;
  userMessage: string;
  botMessage: string;
  responseTimeMs: number;
  modelUsed?: string;
  error?: boolean;
}) {
  try {
    const {
      sessionId,
      ip,
      userMessage,
      botMessage,
      responseTimeMs,
      modelUsed = "llama-3.3-70b-versatile",
      error = false,
    } = params;

    const sql = getNeonClient();
    await sql`
      CREATE TABLE IF NOT EXISTS chatbot_conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(255) NOT NULL,
        visitor_ip VARCHAR(45),
        user_message TEXT NOT NULL,
        bot_response TEXT NOT NULL,
        response_time_ms INTEGER,
        model_used VARCHAR(100) DEFAULT 'llama-3.3-70b-versatile',
        error BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      INSERT INTO chatbot_conversations (
        session_id,
        visitor_ip,
        user_message,
        bot_response,
        response_time_ms,
        model_used,
        error
      )
      VALUES (
        ${sessionId},
        ${anonymizeIp(ip)},
        ${userMessage},
        ${botMessage},
        ${responseTimeMs},
        ${modelUsed},
        ${error}
      )
    `;

    return true;
  } catch (error) {
    console.error("Chat log error", error);
    return false;
  }
}
