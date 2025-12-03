import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/chat/route';
import { CHATBOT_SYSTEM_PROMPT } from '@/prompts/chatbot-system';

const mockCreate = vi.fn().mockResolvedValue({
  choices: [
    {
      message: { content: 'Respuesta con caso Logística' },
    },
  ],
});

vi.mock('@/lib/groq', () => ({
  getGroqClient: () => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }),
}));

vi.mock('@/lib/chat-logger', () => ({
  logChatMessage: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ ok: true }),
}));

describe('POST /api/chat', () => {
  it('returns a bot message including system prompt context', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: '¿Reducís costes AWS?' }],
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.message).toContain('Respuesta');
    expect(CHATBOT_SYSTEM_PROMPT).toMatch(/estimaciones orientativas/i);
  });

  it('returns fallback message on timeout', async () => {
    mockCreate.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ choices: [{ message: { content: 'tarde' } }] }), 9000),
        ),
    );

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hola' }],
      }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(data.message).toMatch(/error técnico/i);
  });
});
