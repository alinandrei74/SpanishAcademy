import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import type { UserData, UserProfile, UserPreferences } from '@/types/user';

export class UserService {
  private static COLLECTION = 'users';

  static async getUser(uid: string): Promise<UserData | null> {
    try {
      const docRef = doc(db, this.COLLECTION, uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        lastLogin: data.lastLogin?.toDate(),
      } as UserData;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  static async updateProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, uid);
      await updateDoc(docRef, {
        'profile': profile,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  static async updatePreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, uid);
      await updateDoc(docRef, {
        'preferences': preferences,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update preferences');
    }
  }

  static async getStudents(teacherId: string): Promise<UserData[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('role', '==', 'student'),
        where('teacherId', 'array-contains', teacherId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastLogin: doc.data().lastLogin?.toDate(),
      } as UserData));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  static async assignTeacher(studentId: string, teacherId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, studentId);
      await updateDoc(docRef, {
        teacherId: arrayUnion(teacherId),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error assigning teacher:', error);
      throw new Error('Failed to assign teacher');
    }
  }

  static async removeTeacher(studentId: string, teacherId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, studentId);
      await updateDoc(docRef, {
        teacherId: arrayRemove(teacherId),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error removing teacher:', error);
      throw new Error('Failed to remove teacher');
    }
  }

  static async updateUserMetadata(uid: string, metadata: any): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, uid);
      await updateDoc(docRef, {
        metadata: metadata,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error('Failed to update user metadata');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  static getDefaultProfile(): UserProfile {
    return {
      bio: '',
      languages: {},
      interests: [],
      availability: {
        monday: { available: false },
        tuesday: { available: false },
        wednesday: { available: false },
        thursday: { available: false },
        friday: { available: false },
        saturday: { available: false },
        sunday: { available: false },
      },
    };
  }

  static async assignStudentToTeacher(studentId: string, teacherId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', studentId);
      await updateDoc(docRef, {
        teacherId: arrayUnion(teacherId),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error assigning student to teacher:', error);
      throw new Error('Failed to assign student to teacher');
    }
  }

  static async removeStudentFromTeacher(studentId: string, teacherId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', studentId);
      await updateDoc(docRef, {
        teacherId: arrayRemove(teacherId),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error removing student from teacher:', error);
      throw new Error('Failed to remove student from teacher');
    }
  }

}