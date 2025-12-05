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

describe('sendNurturingEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('envía email day1 interpolando métricas', async () => {
    const { sendNurturingEmail } = await import('@/lib/email/nurturing');
    await sendNurturingEmail(
      {
        id: 'lead-1',
        email: 'ceo@empresa.com',
        name: 'Fran',
        savings_annual: 28050,
        payback_months: 1,
        calendly_link: 'https://cal.com/fjg',
      },
      'day1',
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.subject).toContain('¿Viste tu ahorro');
    expect(args.html).toContain('28.050');
    expect(args.html).toContain('1');
    expect(args.html).toContain('Fran');
  });

  it('envía email day3 con link desuscribir', async () => {
    process.env.PUBLIC_UNSUBSCRIBE_URL = 'https://fjgaparicio.es/unsubscribe';
    const { sendNurturingEmail } = await import('@/lib/email/nurturing');
    await sendNurturingEmail(
      {
        id: 'lead-2',
        email: 'ops@empresa.com',
        name: 'Ops',
        savings_annual: 12000,
        payback_months: 3,
        calendly_link: 'https://cal.com/fjg',
      },
      'day3',
    );

    const args = sendMock.mock.calls[0][0];
    expect(args.subject).toContain('Última oportunidad');
    expect(args.html).toContain('12.000');
    expect(args.html).toMatch(/Desuscribir/i);
    expect(args.html).toContain('lead-2');
  });
});
