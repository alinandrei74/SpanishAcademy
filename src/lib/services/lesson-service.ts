import { db } from '@/lib/firebase';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  arrayUnion,
  orderBy,
  serverTimestamp,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import type { Lesson, LessonMaterial, LessonObjective, LessonHomework } from '@/types/lesson';

export class LessonService {
  private static COLLECTION = 'lessons';

  static async createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...lessonData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        date: Timestamp.fromDate(lessonData.date)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw new Error('Failed to create lesson');
    }
  }

  static async getLesson(id: string): Promise<Lesson | null> {
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
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Lesson;
    } catch (error) {
      console.error('Error getting lesson:', error);
      throw new Error('Failed to get lesson');
    }
  }

  static async getTeacherLessons(
    teacherId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Lesson[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('teacherId', '==', teacherId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Lesson));
    } catch (error) {
      console.error('Error getting teacher lessons:', error);
      throw new Error('Failed to get lessons');
    }
  }

  static async getStudentLessons(
    studentId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Lesson[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('studentId', '==', studentId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Lesson));
    } catch (error) {
      console.error('Error getting student lessons:', error);
      throw new Error('Failed to get lessons');
    }
  }

  static async updateLesson(id: string, updates: Partial<Lesson>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        ...(updates.date && { date: Timestamp.fromDate(updates.date) })
      });
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw new Error('Failed to update lesson');
    }
  }

  static async addMaterial(lessonId: string, material: Omit<LessonMaterial, 'id'>): Promise<string> {
    try {
      const docRef = doc(db, this.COLLECTION, lessonId);
      const newMaterial = { ...material, id: crypto.randomUUID() };
      await updateDoc(docRef, {
        materials: arrayUnion(newMaterial),
        updatedAt: serverTimestamp(),
      });
      return newMaterial.id;
    } catch (error) {
      console.error('Error adding material:', error);
      throw new Error('Failed to add material');
    }
  }

  static async updateObjectives(lessonId: string, objectives: LessonObjective[]): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, lessonId);
      await updateDoc(docRef, {
        objectives,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating objectives:', error);
      throw new Error('Failed to update objectives');
    }
  }

  static async addHomework(lessonId: string, homework: Omit<LessonHomework, 'id'>): Promise<string> {
    try {
      const docRef = doc(db, this.COLLECTION, lessonId);
      const newHomework = { ...homework, id: crypto.randomUUID() };
      await updateDoc(docRef, {
        homework: newHomework,
        updatedAt: serverTimestamp(),
      });
      return newHomework.id;
    } catch (error) {
      console.error('Error adding homework:', error);
      throw new Error('Failed to add homework');
    }
  }

  static async updateStatus(
    lessonId: string, 
    status: Lesson['status'], 
    notes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, lessonId);
      await updateDoc(docRef, {
        status,
        ...(notes && { notes }),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating status:', error);
      throw new Error('Failed to update status');
    }
  }
}