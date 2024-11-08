import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Invitation, CreateInvitationData } from '@/types/invitation';
import { nanoid } from 'nanoid';

export class InvitationService {
  private static COLLECTION = 'invitations';

  static async createInvitation(data: CreateInvitationData, creatorUid: string): Promise<string> {
    try {
      const id = nanoid(12);
      const expirationDays = data.expirationDays || 7;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      const invitationData = {
        email: data.email,
        role: data.role,
        createdBy: creatorUid,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
        used: false,
      };

      await setDoc(doc(db, this.COLLECTION, id), invitationData);
      return id;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw new Error('Failed to create invitation');
    }
  }

  static async getInvitation(id: string): Promise<Invitation | null> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        expiresAt: data.expiresAt.toDate(),
        usedAt: data.usedAt?.toDate(),
      } as Invitation;
    } catch (error) {
      console.error('Error getting invitation:', error);
      return null;
    }
  }

  static async validateInvitation(id: string): Promise<{
    valid: boolean;
    invitation?: Invitation;
    error?: string;
  }> {
    try {
      const invitation = await this.getInvitation(id);

      if (!invitation) {
        return { valid: false, error: 'Invitation not found' };
      }

      if (invitation.used) {
        return { valid: false, error: 'Invitation already used' };
      }

      if (invitation.expiresAt.getTime() < Date.now()) {
        return { valid: false, error: 'Invitation has expired' };
      }

      return { valid: true, invitation };
    } catch (error) {
      console.error('Error validating invitation:', error);
      return { valid: false, error: 'Error validating invitation' };
    }
  }

  static async markAsUsed(id: string, userUid: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      await setDoc(docRef, {
        used: true,
        usedAt: serverTimestamp(),
        usedBy: userUid,
      }, { merge: true });
    } catch (error) {
      console.error('Error marking invitation as used:', error);
      throw new Error('Failed to update invitation');
    }
  }
}