import { db } from '../firebase';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  writeBatch    
} from 'firebase/firestore';
import type { Notification, NotificationType } from '@/types/notifications';

export class NotificationService {
  private static COLLECTION = 'notifications';

  static async createNotification(
    recipientId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    expiresAt?: Date
  ): Promise<string> {
    try {
      const notificationData = {
        type,
        title,
        message,
        recipientId,
        read: false,
        createdAt: serverTimestamp(),
        data,
        ...(expiresAt && { expiresAt: Timestamp.fromDate(expiresAt) }),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), notificationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  static async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      unreadOnly?: boolean;
      type?: NotificationType;
    } = {}
  ): Promise<Notification[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (options.unreadOnly) {
        q = query(q, where('read', '==', false));
      }

      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        expiresAt: doc.data().expiresAt?.toDate(),
      } as Notification));
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw new Error('Failed to get notifications');
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION, notificationId), {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const unreadQuery = query(
        collection(db, this.COLLECTION),
        where('recipientId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(unreadQuery);
      const batch = writeBatch(db);  // Usamos writeBatch en lugar de db.batch

      querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          readAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  static async deleteExpiredNotifications(): Promise<void> {
    try {
      const expiredQuery = query(
        collection(db, this.COLLECTION),
        where('expiresAt', '<=', Timestamp.now())
      );

      const querySnapshot = await getDocs(expiredQuery);
      const batch = writeBatch(db);  // Usamos writeBatch aquí también

      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error deleting expired notifications:', error);
      throw new Error('Failed to delete expired notifications');
    }
  }

  // Métodos de ayuda para crear notificaciones específicas
  static async notifyReviewReady(
    studentId: string,
    exerciseTitle: string,
    submissionId: string,
    reviewId: string
  ): Promise<void> {
    await this.createNotification(
      studentId,
      'review_ready',
      'Review Ready',
      `Your submission for "${exerciseTitle}" has been reviewed`,
      {
        submissionId,
        reviewId,
      }
    );
  }

  static async notifyNewSubmission(
    teacherId: string,
    studentName: string,
    exerciseTitle: string,
    submissionId: string
  ): Promise<void> {
    await this.createNotification(
      teacherId,
      'new_submission',
      'New Submission',
      `${studentName} has submitted "${exerciseTitle}" for review`,
      {
        submissionId,
      }
    );
  }

  static async notifyAchievement(
    userId: string,
    achievementTitle: string,
    achievementId: string
  ): Promise<void> {
    await this.createNotification(
      userId,
      'achievement',
      'Achievement Unlocked!',
      `Congratulations! You've earned: ${achievementTitle}`,
      {
        achievementId,
      }
    );
  }

  static async createReminder(
    userId: string,
    message: string,
    expiresAt: Date,
    data?: any
  ): Promise<void> {
    await this.createNotification(
      userId,
      'reminder',
      'Reminder',
      message,
      data,
      expiresAt
    );
  }
}