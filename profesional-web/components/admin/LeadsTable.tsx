import type { LeadRecord } from '@/lib/admin/get-leads';
import { NurturingBadge } from '@/components/admin/NurturingBadge';

type LeadsTableProps = {
  leads: LeadRecord[];
};

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Sector</th>
            <th className="px-4 py-3 text-left">Ahorro €/año</th>
            <th className="px-4 py-3 text-left">Payback</th>
            <th className="px-4 py-3 text-left">Stage</th>
            <th className="px-4 py-3 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-900">{lead.email}</td>
              <td className="px-4 py-3 text-slate-700">{lead.name || '-'}</td>
              <td className="px-4 py-3 text-slate-700">{lead.sector || '-'}</td>
              <td className="px-4 py-3 text-slate-900">
                {lead.roi_data?.savingsAnnual?.toLocaleString('es-ES')}€
              </td>
              <td className="px-4 py-3 text-slate-700">{lead.roi_data?.paybackMonths}m</td>
              <td className="px-4 py-3">
                <NurturingBadge stage={lead.nurturing_stage} />
              </td>
              <td className="px-4 py-3 text-slate-700">
                {new Date(lead.created_at).toLocaleDateString('es-ES')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && (
        <p className="px-4 py-3 text-sm text-slate-600">Sin leads todavía.</p>
      )}
    </div>
  );
}
