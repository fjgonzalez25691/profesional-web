import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sendMock = vi.fn();

vi.mock('resend', () => {
  class Resend {
    emails = { send: sendMock };
    constructor() {
      // Empty constructor
    }
  }
  return { Resend };
});

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    readFileSync: vi.fn(() => '<div>{{savingsAnnual}}€ {{sector}}</div>'),
  };
});

describe('POST /api/send-roi-email', () => {
  beforeEach(() => {
    sendMock.mockReset();
    process.env.RESEND_API_KEY = 'test-key';
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('envía email con métricas interpoladas cuando los datos son válidos', async () => {
    const { POST } = await import('@/app/api/send-roi-email/route');

    const payload = {
      email: 'ceo@empresa.com',
      roiData: {
        savingsAnnual: 35700,
        investment: 3200,
        paybackMonths: 1,
        roi3Years: 3247,
      },
      userData: {
        sector: 'agencia',
        companySize: '10-25M',
      },
    };

    const response = await POST(
      new Request('http://localhost/api/send-roi-email', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(response.ok).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.to).toBe('ceo@empresa.com');
    expect(args.html).toContain('35.700');
    expect(args.html).toContain('3.200');
    expect(args.html).toContain('1');
    expect(args.html).toContain('3247');
    expect(args.html).toContain('agencia');
    expect(args.html).toContain('10-25M');
  });

  it('retorna 400 si faltan datos requeridos', async () => {
    const { POST } = await import('@/app/api/send-roi-email/route');

    const response = await POST(
      new Request('http://localhost/api/send-roi-email', {
        method: 'POST',
        body: JSON.stringify({ email: '' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(response.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('propaga error cuando Resend falla', async () => {
    sendMock.mockRejectedValueOnce(new Error('Resend down'));
    const { POST } = await import('@/app/api/send-roi-email/route');

    const response = await POST(
      new Request('http://localhost/api/send-roi-email', {
        method: 'POST',
        body: JSON.stringify({
          email: 'ceo@empresa.com',
          roiData: {
            savingsAnnual: 35700,
            investment: 3200,
            paybackMonths: 1,
            roi3Years: 3247,
          },
          userData: {
            sector: 'agencia',
            companySize: '10-25M',
          },
        }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(response.status).toBe(500);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
