import { db } from '@/lib/firebase';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Exercise, ExerciseSubmission } from '@/types/exercise';

export interface ReviewData {
  submissionId: string;
  score: number;
  feedback: string;
  rubricScores?: Record<string, number>;
  annotations?: Array<{
    text: string;
    type: 'correction' | 'suggestion' | 'praise';
  }>;
  reviewedAt: Date;
  reviewedBy: string;
}

interface PendingReview {
  submission: ExerciseSubmission;
  exercise: Exercise;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export class ReviewService {
  private static SUBMISSIONS_COLLECTION = 'exercise_submissions';
  private static REVIEWS_COLLECTION = 'exercise_reviews';
  private static USERS_COLLECTION = 'users';

  static async getPendingReviews(teacherId: string): Promise<PendingReview[]> {
    try {
      // Obtener todas las submissions que necesitan revisión
      const submissionsQuery = query(
        collection(db, this.SUBMISSIONS_COLLECTION),
        where('status', '==', 'pending'),
        where('teacherId', '==', teacherId),
        orderBy('submittedAt', 'desc')
      );

      const submissionsSnapshot = await getDocs(submissionsQuery);
      const pendingReviews: PendingReview[] = [];

      for (const submissionDoc of submissionsSnapshot.docs) {
        const submission = {
          id: submissionDoc.id,
          ...submissionDoc.data(),
          submittedAt: submissionDoc.data().submittedAt.toDate(),
        } as ExerciseSubmission;

        // Obtener el ejercicio
        const exerciseDoc = await getDoc(doc(db, 'exercises', submission.exerciseId));
        const exercise = { id: exerciseDoc.id, ...exerciseDoc.data() } as Exercise;

        // Obtener datos del estudiante
        const studentDoc = await getDoc(doc(db, this.USERS_COLLECTION, submission.studentId));
        const studentData = studentDoc.data();

        pendingReviews.push({
          submission,
          exercise,
          student: {
            id: studentDoc.id,
            name: studentData?.displayName || 'Unknown',
            email: studentData?.email || 'No email'
          }
        });
      }

      return pendingReviews;
    } catch (error) {
      console.error('Error getting pending reviews:', error);
      throw new Error('Failed to get pending reviews');
    }
  }

  static async submitReview(
    submissionId: string,
    reviewData: Omit<ReviewData, 'reviewedAt' | 'reviewedBy'>,
    reviewerId: string
  ): Promise<void> {
    try {
      // Crear el documento de revisión
      const review = {
        ...reviewData,
        reviewedAt: serverTimestamp(),
        reviewedBy: reviewerId
      };

      await updateDoc(doc(db, this.SUBMISSIONS_COLLECTION, submissionId), {
        status: 'reviewed',
        score: reviewData.score,
        feedback: reviewData.feedback,
        reviewedAt: serverTimestamp(),
        reviewedBy: reviewerId
      });

      // Actualizar las estadísticas del estudiante si es necesario
      const submission = await getDoc(doc(db, this.SUBMISSIONS_COLLECTION, submissionId));
      const submissionData = submission.data();

      if (submissionData) {
        await updateDoc(doc(db, this.USERS_COLLECTION, submissionData.studentId), {
          'metadata.lastReviewedAt': serverTimestamp(),
          [`metadata.scores.${submissionData.exerciseId}`]: reviewData.score
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw new Error('Failed to submit review');
    }
  }

  static async getStudentReviews(studentId: string): Promise<ReviewData[]> {
    try {
      const submissionsQuery = query(
        collection(db, this.SUBMISSIONS_COLLECTION),
        where('studentId', '==', studentId),
        where('status', '==', 'reviewed'),
        orderBy('reviewedAt', 'desc')
      );

      const submissions = await getDocs(submissionsQuery);
      return submissions.docs.map(doc => ({
        submissionId: doc.id,
        ...doc.data(),
        reviewedAt: doc.data().reviewedAt.toDate(),
      }) as ReviewData);
    } catch (error) {
      console.error('Error getting student reviews:', error);
      throw new Error('Failed to get student reviews');
    }
  }
}