import { getNeonClient } from "@/lib/db";

export async function logChatMessage(ip: string, userMessage: string, botMessage: string) {
  try {
    const sql = getNeonClient();
    await sql`
      CREATE TABLE IF NOT EXISTS chat_logs (
        id BIGSERIAL PRIMARY KEY,
        ip TEXT,
        user_message TEXT,
        bot_message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      INSERT INTO chat_logs (ip, user_message, bot_message)
      VALUES (${ip}, ${userMessage}, ${botMessage})
    `;

    return true;
  } catch (error) {
    console.error("Chat log error", error);
    return false;
  }
}
