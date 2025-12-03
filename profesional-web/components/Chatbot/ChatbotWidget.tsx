"use client";

import { useCallback, useState } from "react";
import ChatbotModal, { ChatMessage } from "./ChatbotModal";

const BOT_RESPONSES = [
  "¡Hola! Soy el asistente de Francisco. ¿En qué puedo ayudarte?",
  "Próximamente podré responder consultas específicas sobre optimización Cloud y automatización.",
  "Mientras tanto, puedes agendar una consulta directa usando el botón azul.",
  "¿Te interesa conocer casos de éxito específicos de tu sector?",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const createId = useCallback(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const userMessage: ChatMessage = {
        id: createId(),
        sender: "user",
        text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const history = [...messages, userMessage].map((m) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text,
      }));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!response.ok) {
          throw new Error("Chat API error");
        }

        const data = await response.json();
        const botText: string = data?.message || BOT_RESPONSES[0];

        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            sender: "bot",
            text: botText,
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            sender: "bot",
            text:
              "Disculpa, estoy tardando más de lo esperado. Reintenta en unos segundos o agenda una sesión de 30 minutos para revisarlo juntos.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [createId, messages],
  );

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <ChatbotModal
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        isTyping={isTyping}
        onSend={handleSend}
      />
      <button
        aria-label="Abrir chatbot"
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-9999 hidden md:flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        type="button"
      >
        🤖 Chat
      </button>

      <button
        aria-label="Abrir chatbot"
        onClick={handleToggle}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 flex md:hidden items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        type="button"
      >
        🤖 Chat
      </button>
    </>
  );
}
