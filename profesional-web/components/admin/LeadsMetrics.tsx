import type { LeadRecord } from '@/lib/admin/get-leads';
import { MetricCard } from '@/components/admin/MetricCard';

export function LeadsMetrics({ leads }: { leads: LeadRecord[] }) {
  const totalLeads = leads.length;
  const bookedCount = leads.filter((l) => l.calendly_booked).length;
  const conversionRate = totalLeads > 0 ? ((bookedCount / totalLeads) * 100).toFixed(1) : '0.0';
  const avgPayback =
    totalLeads > 0
      ? (leads.reduce((sum, l) => sum + (l.roi_data.paybackMonths || 0), 0) / totalLeads).toFixed(1)
      : '0.0';

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
      <MetricCard label="Total Leads" value={totalLeads} />
      <MetricCard label="Agendados" value={bookedCount} />
      <MetricCard label="Conversión" value={`${conversionRate}%`} />
      <MetricCard label="Payback Promedio" value={`${avgPayback}m`} />
    </div>
  );
}
