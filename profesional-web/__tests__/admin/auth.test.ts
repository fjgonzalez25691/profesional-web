import { describe, expect, it } from 'vitest';

describe('Admin Auth', () => {
  it('POST /admin/login - password correcto', async () => {
    process.env.ADMIN_PASSWORD = 'secret';
    process.env.ADMIN_TOKEN = 'token-123';
    const { POST } = await import('@/app/admin/login/route');
    const res = await POST(
      new Request('http://localhost/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password: 'secret' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(res.status).toBe(200);
    const cookies = res.headers.get('set-cookie') || '';
    expect(cookies).toContain('admin_auth=');
  });

  it('POST /admin/login - password incorrecto', async () => {
    process.env.ADMIN_PASSWORD = 'secret';
    process.env.ADMIN_TOKEN = 'token-123';
    const { POST } = await import('@/app/admin/login/route');
    const res = await POST(
      new Request('http://localhost/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password: 'wrong' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(res.status).toBe(401);
  });
});
