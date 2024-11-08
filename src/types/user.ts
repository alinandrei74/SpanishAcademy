export type UserRole = 'student' | 'teacher' | 'admin';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface UserProfile {
  displayName?: string;
  bio?: string;
  languages?: {
    [key: string]: {
      level: LanguageLevel;
      certified: boolean;
      certificationDate?: Date;
    };
  };
  interests?: string[];
  availability?: {
    [key: string]: {
      available: boolean;
      slots?: {
        start: string;
        end: string;
      }[];
    };
  };
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  metadata?: {
    completedLessons?: number;
    totalLessons?: number;
    averageRating?: number;
    certificationsCount?: number;
    nextClass?: string;
  };
  teacherId?: string[];
}