export interface Invitation {
    id: string;
    email: string;
    role: 'student' | 'teacher';
    createdAt: Date;
    expiresAt: Date;
    createdBy: string;
    used: boolean;
    usedAt?: Date;
    usedBy?: string;
  }
  
  export interface CreateInvitationData {
    email: string;
    role: 'student' | 'teacher';
    expirationDays?: number;
  }