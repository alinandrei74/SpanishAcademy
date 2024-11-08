'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/auth/auth-context";
import {
  LayoutGrid,
  Users,
  Calendar,
  FileText,
  CheckSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick: () => void;
}

function NavItem({ href, icon, text, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </button>
  );
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userData && userData.role !== 'teacher') {
      router.push('/dashboard');
    }
  }, [userData, router]);

  if (!userData || userData.role !== 'teacher') {
    return null;
  }

  const navItems = [
    {
      href: '/teacher/dashboard',
      icon: <LayoutGrid className="h-4 w-4" />,
      text: 'Dashboard'
    },
    {
      href: '/teacher/students',
      icon: <Users className="h-4 w-4" />,
      text: 'Students'
    },
    {
      href: '/teacher/calendar',
      icon: <Calendar className="h-4 w-4" />,
      text: 'Calendar'
    },
    {
      href: '/teacher/reviews',
      icon: <CheckSquare className="h-4 w-4" />,
      text: 'Reviews'
    },
    {
      href: '/teacher/notes',
      icon: <FileText className="h-4 w-4" />,
      text: 'Notes'
    },
    {
      href: '/teacher/settings',
      icon: <Settings className="h-4 w-4" />,
      text: 'Settings'
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Teacher Panel</h2>
          <p className="text-sm text-muted-foreground">{userData.displayName}</p>
        </div>
        
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={false} // TODO: Implementar lógica de ruta activa
              onClick={() => router.push(item.href)}
            />
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}