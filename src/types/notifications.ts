export type NotificationType = 
  | 'review_ready'      // Cuando una revisión está lista
  | 'new_submission'    // Cuando un estudiante envía un ejercicio
  | 'reminder'          // Recordatorios de tareas pendientes
  | 'feedback'          // Cuando se recibe feedback
  | 'achievement'       // Logros desbloqueados
  | 'system';           // Notificaciones del sistema

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  read: boolean;
  createdAt: Date;
  data?: {
    exerciseId?: string;
    submissionId?: string;
    reviewId?: string;
    lessonId?: string;
    achievementId?: string;
    [key: string]: any;
  };
  link?: string;
  expiresAt?: Date;
}