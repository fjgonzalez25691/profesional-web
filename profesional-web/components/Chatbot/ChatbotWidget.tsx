"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const createId = useCallback(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  const sendMockResponse = useCallback(() => {
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      const response = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          sender: "bot",
          text: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, process.env.NODE_ENV === "test" ? 100 : 1200);
  }, [createId]);

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        sender: "user",
        text,
        timestamp: new Date(),
      },
    ]);
    sendMockResponse();
  }, [createId, sendMockResponse]);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

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
