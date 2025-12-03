"use client";

import { FormEvent, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import MessageBubble, { ChatMessage } from "./MessageBubble";
import { cn } from "@/lib/utils";

export type { ChatMessage };

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (text: string) => void;
}

export default function ChatbotModal({
  isOpen,
  onClose,
  messages,
  isTyping,
  onSend,
}: ChatbotModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (scrollRef.current?.scrollIntoView) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value?.trim();
    if (!value) return;
    onSend(value);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chatbot"
      className="fixed inset-0 z-[9999] flex items-end justify-center md:justify-end"
    >
      <button
        aria-label="Cerrar chatbot"
        className="absolute inset-0 bg-black/30 md:bg-transparent"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative flex w-full max-w-full flex-col rounded-t-3xl bg-white shadow-2xl md:rounded-2xl md:w-96 md:h-[600px] md:bottom-24 md:right-6 md:mr-6",
          "border border-slate-200"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">Chatbot</p>
            <p className="text-xs text-slate-500">Pregúntame lo que necesites</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar chatbot"
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">Historial vacío.</p>
          )}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="self-start rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
              Escribiendo...
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 px-3 py-3">
          <input
            ref={inputRef}
            type="text"
            name="chatbot-input"
            placeholder="¿En qué puedo ayudarte?"
            autoFocus
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            aria-label="Campo de mensaje del chatbot"
          />
          <button
            type="submit"
            aria-label="Enviar mensaje"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
