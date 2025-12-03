import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatbotModal, { ChatMessage } from '@/components/Chatbot/ChatbotModal';

describe('ChatbotModal', () => {
  const baseMessages: ChatMessage[] = [
    { id: '1', text: 'Hola', sender: 'user', timestamp: new Date() },
    { id: '2', text: 'Hola, soy el asistente', sender: 'bot', timestamp: new Date() },
  ];

  it('renders messages with correct alignment and placeholder/input', async () => {
    render(
      <ChatbotModal
        isOpen
        onClose={() => {}}
        messages={baseMessages}
        isTyping={false}
        onSend={() => {}}
      />,
    );

    const input = screen.getByPlaceholderText(/¿en qué puedo ayudarte\?/i);
    expect(input).toBeInTheDocument();

    const userMessage = screen.getByText('Hola');
    const botMessage = screen.getByText('Hola, soy el asistente');

    expect(userMessage.parentElement?.className).toMatch(/self-end/);
    expect(botMessage.parentElement?.className).toMatch(/self-start/);
  });

  it('scrolls to the latest message when new content appears', async () => {
    const scrollSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    const { rerender } = render(
      <ChatbotModal
        isOpen
        onClose={() => {}}
        messages={[]}
        isTyping={false}
        onSend={() => {}}
      />,
    );

    rerender(
      <ChatbotModal
        isOpen
        onClose={() => {}}
        messages={baseMessages}
        isTyping
        onSend={() => {}}
      />,
    );

    await waitFor(() => {
      expect(scrollSpy).toHaveBeenCalled();
    });
  });
});
