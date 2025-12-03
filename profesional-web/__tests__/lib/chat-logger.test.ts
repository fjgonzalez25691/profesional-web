import { describe, it, expect, vi, beforeEach } from 'vitest';

const makeMockSql = () => {
  const calls: Array<{ strings: TemplateStringsArray; values: unknown[] }> = [];
  const fn = vi.fn(async (strings: TemplateStringsArray, ...values: unknown[]) => {
    calls.push({ strings, values });
    return Promise.resolve();
  });
  return { fn, calls };
};

describe('chat logger', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('creates table if needed and inserts log entry', async () => {
    const { fn: mockSql, calls } = makeMockSql();
    vi.doMock('@/lib/db', () => ({
      getNeonClient: () => mockSql,
    }));
    const { logChatMessage: logMessage } = await import('@/lib/chat-logger');

    const result = await logMessage({
      sessionId: 'session-123',
      ip: '1.1.1.1',
      userMessage: 'hola',
      botMessage: 'respuesta',
      responseTimeMs: 120,
      modelUsed: 'llama-3.3-70b-versatile',
      error: false,
    });

    expect(result).toBe(true);
    expect(calls).toHaveLength(2);
    expect(calls[1]?.values).toEqual([
      'session-123',
      '1.1.0.0',
      'hola',
      'respuesta',
      120,
      'llama-3.3-70b-versatile',
      false,
    ]);
  });

  it('returns false on insertion error', async () => {
    const mockSql = vi.fn(async () => {
      throw new Error('db down');
    });
    vi.doMock('@/lib/db', () => ({
      getNeonClient: () => mockSql,
    }));
    const { logChatMessage: logMessage } = await import('@/lib/chat-logger');

    const result = await logMessage({
      sessionId: 'session-123',
      ip: '1.1.1.1',
      userMessage: 'hola',
      botMessage: 'respuesta',
      responseTimeMs: 120,
      modelUsed: 'llama-3.3-70b-versatile',
      error: true,
    });

    expect(result).toBe(false);
  });
});
