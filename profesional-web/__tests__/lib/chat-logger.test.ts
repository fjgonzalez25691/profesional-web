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

    const result = await logMessage('1.1.1.1', 'hola', 'respuesta');

    expect(result).toBe(true);
    expect(calls).toHaveLength(2);
    expect(calls[1]?.values).toEqual(['1.1.1.1', 'hola', 'respuesta']);
  });

  it('returns false on insertion error', async () => {
    const mockSql = vi.fn(async () => {
      throw new Error('db down');
    });
    vi.doMock('@/lib/db', () => ({
      getNeonClient: () => mockSql,
    }));
    const { logChatMessage: logMessage } = await import('@/lib/chat-logger');

    const result = await logMessage('1.1.1.1', 'hola', 'respuesta');

    expect(result).toBe(false);
  });
});
