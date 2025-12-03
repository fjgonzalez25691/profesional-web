"use client";

import { cn } from "@/lib/utils";

export type ChatSender = "user" | "bot";

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: Date;
}

function formatRelative(timestamp: Date) {
  const diffMs = Date.now() - timestamp.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin <= 0) return "ahora";
  if (diffMin === 1) return "hace 1 min";
  if (diffMin < 60) return `hace ${diffMin} mins`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr === 1) return "hace 1 h";
  return `hace ${diffHr} h`;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      data-testid="message-bubble"
      className={cn(
        "flex max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-3 text-sm shadow-sm",
        isUser
          ? "self-end bg-blue-600 text-white"
          : "self-start bg-slate-100 text-slate-800"
      )}
    >
      <p className="leading-relaxed">{message.text}</p>
      <span className={cn("text-[11px] uppercase tracking-wide", isUser ? "text-blue-100" : "text-slate-500")}>
        {formatRelative(message.timestamp)}
      </span>
    </div>
  );
}
