import { ReactNode } from 'react';
import Sidebar from './components/sidebar/sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: LayoutProps) {

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}

