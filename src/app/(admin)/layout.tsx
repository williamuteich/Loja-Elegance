import { ReactNode } from 'react';
import Sidebar from './components/sidebar';
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  const validaUser = session?.user.role

  if(!validaUser){
    redirect('/')
    return;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 xl:p-2">
        {children}
      </div>
    </div>
  );
}

