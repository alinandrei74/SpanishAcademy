import { db } from '@/lib/firebase';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface StudentNote {
  id: string;
  studentId: string;
  teacherId: string;
  content: string;
  category: 'progress' | 'behavior' | 'homework' | 'general';
  createdAt: Date;
  lessonId?: string;
  isPrivate: boolean;
  tags?: string[];
}

export class NotesService {
  private static COLLECTION = 'notes';

  static async addNote(note: Omit<StudentNote, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...note,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding note:', error);
      throw new Error('Failed to add note');
    }
  }

  static async getStudentNotes(
    studentId: string,
    options?: {
      category?: StudentNote['category'];
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<StudentNote[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );

      if (options?.category) {
        q = query(q, where('category', '==', options.category));
      }

      if (options?.startDate) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(options.startDate)));
      }

      if (options?.endDate) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(options.endDate)));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as StudentNote));
    } catch (error) {
      console.error('Error getting notes:', error);
      throw new Error('Failed to get notes');
    }
  }

  static async getLessonNotes(lessonId: string): Promise<StudentNote[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('lessonId', '==', lessonId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as StudentNote));
    } catch (error) {
      console.error('Error getting lesson notes:', error);
      throw new Error('Failed to get lesson notes');
    }
  }
}