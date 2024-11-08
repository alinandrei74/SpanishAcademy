'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { LessonService } from '@/lib/services/lesson-service';
import type { Lesson } from '@/types/lesson';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserData } from "@/types/user";
import { LessonDialog } from "@/components/teacher/lesson-dialog";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function TeacherCalendarPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<UserData[]>([]);
  const [showNewLessonDialog, setShowNewLessonDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);

  // Cargar estudiantes
  useEffect(() => {
    const loadStudents = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'student')
        );
        
        const querySnapshot = await getDocs(q);
        const loadedStudents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          lastLogin: doc.data().lastLogin?.toDate(),
        })) as UserData[];
        
        setStudents(loadedStudents);
      } catch (error) {
        console.error('Error loading students:', error);
      }
    };

    loadStudents();
  }, [user]);

  const loadLessons = async () => {
    if (!user || !selectedDate) return;

    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    try {
      const monthLessons = await LessonService.getTeacherLessons(
        user.uid,
        startOfMonth,
        endOfMonth
      );
      setLessons(monthLessons);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [user, selectedDate]);

  const getDayLessons = (date: Date) => {
    return lessons.filter(lesson => 
      lesson.date.getDate() === date.getDate() &&
      lesson.date.getMonth() === date.getMonth() &&
      lesson.date.getFullYear() === date.getFullYear()
    );
  };

  const handleNewLesson = () => {
    setShowNewLessonDialog(true);
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time);
    handleNewLesson();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button onClick={handleNewLesson}>
          Schedule New Lesson
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate?.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              {getDayLessons(selectedDate || new Date()).length} lessons scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeSlots.map((time) => {
                const lessonAtTime = getDayLessons(selectedDate || new Date())
                  .find(lesson => lesson.startTime === time);

                return (
                  <div
                    key={time}
                    className={`p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors ${
                      lessonAtTime ? 'bg-secondary' : 'bg-background'
                    }`}
                    onClick={() => !lessonAtTime && handleTimeSlotClick(time)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{time}</span>
                      {lessonAtTime ? (
                        <div className="flex items-center space-x-4">
                          <span>{lessonAtTime.topic}</span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <LessonDialog
        open={showNewLessonDialog}
        onOpenChange={setShowNewLessonDialog}
        studentId={selectedStudentId}
        initialData={{
          date: selectedDate,
          startTime: selectedTimeSlot,
          type: 'individual',
          status: 'scheduled'
        }}
        onSaved={() => {
          loadLessons();
          setSelectedStudentId('');
          setSelectedTimeSlot(timeSlots[0]);
        }}
      />
    </div>
  );
}