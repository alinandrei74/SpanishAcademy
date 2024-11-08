export type LessonStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type LessonType = 'individual' | 'group' | 'workshop';
export type ProficiencyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LessonMaterial {
  id: string;
  type: 'document' | 'video' | 'audio' | 'exercise';
  title: string;
  description?: string;
  url?: string;
  content?: string;
  attachments?: string[];
}

export interface LessonObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface LessonHomework {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  attachments?: string[];
}

export interface Lesson {
  id: string;
  teacherId: string;
  studentId: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: LessonStatus;
  type: LessonType;
  level: ProficiencyLevel;
  topic: string;
  objectives: LessonObjective[];
  materials: LessonMaterial[];
  homework?: LessonHomework;
  notes?: string;
  feedback?: {
    teacherNotes?: string;
    studentFeedback?: {
      rating: number;
      comment?: string;
    };
  };
  meetingLink?: string;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}