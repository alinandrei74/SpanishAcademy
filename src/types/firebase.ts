export interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'student' | 'teacher' | 'admin';
    createdAt: Date;
    lastLogin: Date;
  }
  
  export interface FirebaseError {
    code: string;
    message: string;
  }