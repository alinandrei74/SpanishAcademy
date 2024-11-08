'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/app/auth/auth-context";

export default function TeacherDashboard() {
  const { userData } = useAuth();

  const upcomingLessons = [
    { student: "John Doe", date: "2024-10-29", time: "10:00 AM", status: "Confirmed" },
    { student: "Jane Smith", date: "2024-10-29", time: "11:30 AM", status: "Pending" },
    // Add more mock data as needed
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Classes This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">4 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">From 45 reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hours Taught</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>Your schedule for the next 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingLessons.map((lesson, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{lesson.student}</TableCell>
                  <TableCell>{lesson.date}</TableCell>
                  <TableCell>{lesson.time}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${lesson.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                      {lesson.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Manage your current students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => window.location.href = '/teacher/students'}>
              View All Students
            </Button>
            <Button variant="outline" className="w-full">
              Send Group Message
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Management</CardTitle>
            <CardDescription>Manage your availability and classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => window.location.href = '/teacher/calendar'}>
              View Calendar
            </Button>
            <Button variant="outline" className="w-full">
              Update Availability
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}