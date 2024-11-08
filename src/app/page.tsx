import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import FirebaseTest from './firebase-test';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Avatar and Dropdown */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">Language Learning Platform</h1>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Welcome Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>Continue your language learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Track your progress, schedule lessons, and improve your language skills.
            </p>
            <div className="flex gap-4">
              <Button>Schedule a Lesson</Button>
              <Button variant="outline">View Progress</Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Next Lesson</CardTitle>
              <CardDescription>Upcoming scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">
                View Progress
              </Button>
            </CardContent>
          </Card>
        </div>
        <FirebaseTest />
      </div>
    </main>
  )
}