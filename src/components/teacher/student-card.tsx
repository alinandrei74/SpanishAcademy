'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, Calendar, FileText } from "lucide-react";
import type { UserData } from "@/types/user";
import { useRouter } from 'next/navigation';

interface StudentCardProps {
  student: UserData;
  onScheduleClass: (studentId: string) => void;
  onSendMessage: (studentId: string) => void;
}

export function StudentCard({ student, onScheduleClass, onSendMessage }: StudentCardProps) {
  const router = useRouter();
  const lastLesson = student.metadata?.completedLessons || 0;
  const progress = (lastLesson / (student.metadata?.totalLessons || 1)) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={student.photoURL || undefined} alt={student.displayName} />
            <AvatarFallback>{student.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{student.displayName}</CardTitle>
            <CardDescription>{student.email}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => router.push(`/teacher/students/${student.uid}?tab=profile`)}
            >
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onScheduleClass(student.uid)}>
              Schedule Class
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
  onClick={() => {
    const url = `/teacher/students/${student.uid}?tab=notes`;
    console.log('Attempting to navigate to:', url);
    router.push(url);
  }}
>
  View Notes
</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSendMessage(student.uid)}>
              Send Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Next class: {student.metadata?.nextClass || 'Not scheduled'}</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Lessons: {lastLesson}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}