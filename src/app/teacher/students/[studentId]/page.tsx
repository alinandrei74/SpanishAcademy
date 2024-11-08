'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { UserService } from "@/lib/services/user-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/types/user";
import { StudentNotes } from "@/components/teacher/student-notes";

export default function StudentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const studentId = params.studentId as string;
  const [student, setStudent] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const tab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    console.log('Current tab:', tab);
    console.log('Student ID:', studentId);
  }, [tab, studentId]);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const studentData = await UserService.getUser(studentId);
        setStudent(studentData);
      } catch (error) {
        console.error('Error loading student:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with student info */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.photoURL || undefined} alt={student.displayName} />
              <AvatarFallback>{student.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{student.displayName}</h1>
              <p className="text-muted-foreground">{student.email}</p>
              <div className="flex items-center space-x-4 mt-4">
                <Button>Schedule Lesson</Button>
                <Button variant="outline">Send Message</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue={tab} value={tab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Student's personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Bio</h3>
                  <p>{student.profile?.bio || 'No bio provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Languages</h3>
                  <div className="mt-2">
                    {Object.entries(student.profile?.languages || {}).map(([lang, data]) => (
                      <div key={lang} className="flex justify-between items-center">
                        <span>{lang}</span>
                        <span>{data.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Progress content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Lessons content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes for {student.displayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentNotes studentId={studentId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}