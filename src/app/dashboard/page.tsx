'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateInvitation } from "@/components/create-invitation";
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Dashboard() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={userData?.photoURL || undefined} alt={userData?.displayName || 'User'} />
                  <AvatarFallback>{userData?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto py-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Next Lesson</CardTitle>
              <CardDescription>Your upcoming scheduled lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">No lessons scheduled</p>
              <Button className="w-full">Schedule Lesson</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Complete your first lesson to see progress</p>
              <Button variant="secondary" className="w-full">View Details</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Learning materials and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Access your learning resources</p>
              <Button variant="outline" className="w-full">Browse Resources</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sección de estadísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userData?.metadata?.totalLessons || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userData?.metadata?.completedLessons || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userData?.metadata?.averageRating || '0.0'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userData?.metadata?.certificationsCount || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Card */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>Manage your upcoming classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Next Class</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/teacher/calendar')}
                  >
                    View Calendar
                  </Button>
                </div>
                <div className="divide-y">
                  {userData?.metadata?.nextClass ? (
                    <div className="py-2">
                      <p className="font-medium">{userData.metadata.nextClass}</p>
                      <p className="text-sm text-muted-foreground">
                        Upcoming class
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">
                      No upcoming classes scheduled
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón temporal para establecer rol de profesor */}
        {userData?.role !== 'teacher' && (
          <Button 
            onClick={async () => {
              if (!user) return;
              try {
                await setDoc(doc(db, 'users', user.uid), {
                  role: 'teacher'
                }, { merge: true });
                window.location.reload();
              } catch (error) {
                console.error('Error updating role:', error);
              }
            }}
            className="mt-4"
          >
            Set as Teacher
          </Button>
        )}

        {/* Sistema de invitaciones (temporalmente aquí para pruebas) */}
        <div className="mt-6">
          <CreateInvitation />
        </div>
      </main>
    </div>
  );
}