import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin', process.env.NEXTAUTH_URL || 'https://fjgaparicio.es'));
  
  // Eliminar cookie de autenticación
  response.cookies.delete('admin_auth');
  
  return response;
}

export async function GET() {
  return POST();
}
