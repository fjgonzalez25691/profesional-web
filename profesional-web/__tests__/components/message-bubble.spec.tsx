import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MessageBubble from '@/components/Chatbot/MessageBubble';

describe('MessageBubble', () => {
  it('renders user bubble aligned to the right with blue background', () => {
    render(
      <MessageBubble
        message={{
          id: '1',
          text: 'Mensaje usuario',
          sender: 'user',
          timestamp: new Date(),
        }}
      />,
    );

    const bubble = screen.getByText('Mensaje usuario').parentElement;
    expect(bubble?.className).toMatch(/self-end/);
    expect(bubble?.className).toMatch(/bg-blue-600/);
  });

  it('renders bot bubble aligned to the left with slate background', () => {
    render(
      <MessageBubble
        message={{
          id: '2',
          text: 'Mensaje bot',
          sender: 'bot',
          timestamp: new Date(),
        }}
      />,
    );

    const bubble = screen.getByText('Mensaje bot').parentElement;
    expect(bubble?.className).toMatch(/self-start/);
    expect(bubble?.className).toMatch(/bg-slate-100/);
  });
});
