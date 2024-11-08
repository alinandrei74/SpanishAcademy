'use client';

import { useAuth } from "@/app/auth/auth-context";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, BookOpen, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (!user || !userData) return null;

  return (
    <div className="border-b">
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Language Platform</h1>
            <nav className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => router.push('/dashboard')}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => router.push('/exercises')}
              >
                <BookOpen className="h-4 w-4" />
                Exercises
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src={userData.photoURL || undefined} alt={userData.displayName} />
                    <AvatarFallback>{userData.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}