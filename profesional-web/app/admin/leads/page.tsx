import { cookies } from 'next/headers';
import { LeadsMetrics } from '@/components/admin/LeadsMetrics';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { getLeads } from '@/lib/admin/get-leads';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Forzar renderizado dinámico para evitar prerender durante build
export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  // Middleware ya verificó autenticación, aquí solo obtenemos datos
  const leads = await getLeads();

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin"
          className="p-2 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Volver al dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Leads Capturados</h1>
      </div>
      <LeadsMetrics leads={leads} />
      <LeadsTable leads={leads} />
    </div>
  );
}
