import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import Link from 'next/link';
import { Users, Calculator, Palette } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('admin_auth')?.value;

  if (!process.env.ADMIN_TOKEN || !process.env.ADMIN_PASSWORD) {
    return <div className="p-8 text-red-700">Config ADMIN_TOKEN/ADMIN_PASSWORD requerida</div>;
  }

  // Si no está autenticado, mostrar formulario de login
  if (authToken !== process.env.ADMIN_TOKEN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">
            Panel Administrativo
          </h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar dashboard con enlaces
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Panel Administrativo</h1>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card Leads */}
          <Link
            href="/admin/leads"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Gestión de Leads</h2>
            </div>
            <p className="text-slate-600">
              Visualiza y gestiona todos los leads capturados desde la calculadora ROI.
            </p>
          </Link>

          {/* Card Calculadora */}
          <Link
            href="/admin/calculadora"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-slate-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Calculadora ROI</h2>
            </div>
            <p className="text-slate-600">
              Accede a la calculadora ROI para pruebas y validación interna.
            </p>
          </Link>

          {/* Card Testing Themes */}
          <div className="block p-6 bg-white rounded-lg shadow border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Testing de Temas</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Cambia la paleta de colores global para probar diferentes estilos visuales.
            </p>
            <div className="flex justify-start">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
