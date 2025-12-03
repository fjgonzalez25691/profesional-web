import { useState } from "react";

export function useChatSessionId() {
  const [sessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "";

    const existing = window.sessionStorage.getItem("chatbot_session_id");
    if (existing) return existing;

    const newId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    window.sessionStorage.setItem("chatbot_session_id", newId);
    return newId;
  });

  return sessionId;
}
