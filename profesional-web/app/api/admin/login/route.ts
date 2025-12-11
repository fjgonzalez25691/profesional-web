import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Config admin incompleta' }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const token = process.env.ADMIN_TOKEN;
  const res = NextResponse.json({ success: true });
  
  // secure: false en desarrollo para que funcione con http://localhost
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookies.set('admin_auth', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return res;
}
