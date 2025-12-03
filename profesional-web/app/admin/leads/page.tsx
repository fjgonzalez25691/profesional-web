import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import { LeadsMetrics } from '@/components/admin/LeadsMetrics';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { getLeads } from '@/lib/admin/get-leads';

export default async function AdminLeadsPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('admin_auth')?.value;

  if (!process.env.ADMIN_TOKEN || !process.env.ADMIN_PASSWORD) {
    return <div className="p-8 text-red-700">Config ADMIN_TOKEN/ADMIN_PASSWORD requerida</div>;
  }

  if (authToken !== process.env.ADMIN_TOKEN) {
    return <LoginForm />;
  }

  const leads = await getLeads();

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Leads Capturados</h1>
      <LeadsMetrics leads={leads} />
      <LeadsTable leads={leads} />
    </div>
  );
}
