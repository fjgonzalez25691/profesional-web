import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Admin - Leads',
  description: 'Panel de administración para gestión de leads',
  robots: 'noindex,nofollow'
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}