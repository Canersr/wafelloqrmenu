import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors">
            Wafello Yönetim Paneli
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
            Siteye Dön
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
