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
  orderBy,
  serverTimestamp,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import type { 
  Exercise, 
  ExerciseSubmission, 
  ExerciseResult 
} from '@/types/exercise';

export class ExerciseService {
  private static COLLECTION = 'exercises';
  private static SUBMISSIONS_COLLECTION = 'exercise_submissions';

  static async createExercise(exercise: Omit<Exercise, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...exercise,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw new Error('Failed to create exercise');
    }
  }

  static async getExercise(id: string): Promise<Exercise | null> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Exercise;
    } catch (error) {
      console.error('Error getting exercise:', error);
      throw new Error('Failed to get exercise');
    }
  }

  static async getLessonExercises(lessonId: string): Promise<Exercise[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('lessonId', '==', lessonId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Exercise));
    } catch (error) {
      console.error('Error getting exercises:', error);
      throw new Error('Failed to get exercises');
    }
  }

  static async submitExercise(
    submission: Omit<ExerciseSubmission, 'id' | 'submittedAt'>
  ): Promise<ExerciseResult> {
    try {
      // Obtener el ejercicio
      const exercise = await this.getExercise(submission.exerciseId);
      if (!exercise) {
        throw new Error('Exercise not found');
      }

      // Evaluar la respuesta según el tipo de ejercicio
      const result = await this.evaluateSubmission(exercise, submission.answer);

      // Guardar la submission
      const submissionData = {
        ...submission,
        submittedAt: serverTimestamp(),
        score: result.score,
        feedback: result.feedback,
      };

      await addDoc(collection(db, this.SUBMISSIONS_COLLECTION), submissionData);

      return result;
    } catch (error) {
      console.error('Error submitting exercise:', error);
      throw new Error('Failed to submit exercise');
    }
  }

  private static async evaluateSubmission(
    exercise: Exercise,
    answer: any
  ): Promise<ExerciseResult> {
    switch (exercise.type) {
      case 'multiple-choice':
        return this.evaluateMultipleChoice(exercise, answer);
      case 'fill-in-blanks':
        return this.evaluateFillInBlanks(exercise, answer);
      case 'matching':
        return this.evaluateMatching(exercise, answer);
      case 'ordering':
        return this.evaluateOrdering(exercise, answer);
      case 'translation':
        return this.evaluateTranslation(exercise, answer);
      case 'free-writing':
        return {
          correct: false,
          score: 0,
          feedback: 'Pending teacher review',
          details: {
            correctAnswers: 0, // Ajusta según el contexto
            totalQuestions: 0, // Ajusta según el contexto
            pending: true      // Puedes incluir esta propiedad si es relevante
          }
        };
      default:
        throw new Error('Unsupported exercise type');
    }
  }

  private static evaluateMultipleChoice(
    exercise: Exercise & { type: 'multiple-choice' },
    answer: string[]
  ): ExerciseResult {
    const correctAnswers = exercise.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id);

    const isCorrect = 
      correctAnswers.length === answer.length &&
      correctAnswers.every(id => answer.includes(id));

    return {
      correct: isCorrect,
      score: isCorrect ? exercise.points : 0,
      details: {
        correctAnswers: answer.filter(id => correctAnswers.includes(id)).length,
        totalQuestions: correctAnswers.length
      }
    };
  }

  private static evaluateFillInBlanks(
    exercise: Exercise & { type: 'fill-in-blanks' },
    answer: Record<string, string>
  ): ExerciseResult {
    const results = exercise.blanks.map(blank => ({
      id: blank.id,
      correct: blank.answer.toLowerCase() === answer[blank.id]?.toLowerCase()
    }));

    const correctCount = results.filter(r => r.correct).length;
    const totalQuestions = exercise.blanks.length;
    const score = (correctCount / totalQuestions) * exercise.points;

    return {
      correct: correctCount === totalQuestions,
      score,
      details: {
        correctAnswers: correctCount,
        totalQuestions,
        incorrectItems: results
          .filter(r => !r.correct)
          .map(r => r.id)
      }
    };
  }

  private static evaluateMatching(
    exercise: Exercise & { type: 'matching' },
    answer: Record<string, string>
  ): ExerciseResult {
    const correctPairs = exercise.pairs.map(pair => ({
      left: pair.left,
      right: pair.right
    }));

    const results = Object.entries(answer).map(([left, right]) => {
      const correctPair = correctPairs.find(pair => pair.left === left);
      return {
        left,
        correct: correctPair?.right === right
      };
    });

    const correctCount = results.filter(r => r.correct).length;
    const totalQuestions = exercise.pairs.length;
    const score = (correctCount / totalQuestions) * exercise.points;

    return {
      correct: correctCount === totalQuestions,
      score,
      details: {
        correctAnswers: correctCount,
        totalQuestions,
        incorrectItems: results
          .filter(r => !r.correct)
          .map(r => r.left)
      }
    };
  }

  private static evaluateOrdering(
    exercise: Exercise & { type: 'ordering' },
    answer: number[]
  ): ExerciseResult {
    const isCorrect = JSON.stringify(answer) === JSON.stringify(exercise.correctOrder);
    
    let correctPositions = 0;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === exercise.correctOrder[i]) {
        correctPositions++;
      }
    }

    const score = (correctPositions / exercise.correctOrder.length) * exercise.points;

    return {
      correct: isCorrect,
      score,
      details: {
        correctAnswers: correctPositions,
        totalQuestions: exercise.correctOrder.length,
        incorrectItems: answer
          .map((pos, idx) => pos !== exercise.correctOrder[idx] ? idx.toString() : null)
          .filter((idx): idx is string => idx !== null)
      }
    };
  }

  private static evaluateTranslation(
    exercise: Exercise & { type: 'translation' },
    answer: string
  ): ExerciseResult {
    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedTranslations = exercise.acceptableTranslations.map(t => 
      t.toLowerCase().trim()
    );

    const isExactMatch = normalizedTranslations.includes(normalizedAnswer);
    
    // Si no hay coincidencia exacta, verificar palabras clave
    let keywordScore = 0;
    if (!isExactMatch && exercise.keywords) {
      const normalizedKeywords = exercise.keywords.map(k => k.toLowerCase().trim());
      const foundKeywords = normalizedKeywords.filter(keyword => 
        normalizedAnswer.includes(keyword)
      );
      keywordScore = (foundKeywords.length / normalizedKeywords.length) * 0.8; // 80% máximo por keywords
    }

    const score = isExactMatch ? exercise.points : Math.floor(keywordScore * exercise.points);

    return {
      correct: isExactMatch,
      score,
      details: {
        correctAnswers: isExactMatch ? 1 : 0,
        totalQuestions: 1,
        suggestions: isExactMatch ? undefined : exercise.acceptableTranslations
      }
    };
  }

  // Implementar resto de métodos de evaluación según sea necesario...

  static async getStudentExercises(
    studentId: string,
    lessonId?: string
  ): Promise<(Exercise & { submission?: ExerciseSubmission })[]> {
    try {
      let exercisesQuery = query(collection(db, this.COLLECTION));
      
      if (lessonId) {
        exercisesQuery = query(
          exercisesQuery,
          where('lessonId', '==', lessonId)
        );
      }

      const exercises = await getDocs(exercisesQuery);
      const exerciseList = exercises.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Exercise));

      // Obtener submissions del estudiante
      const submissionsQuery = query(
        collection(db, this.SUBMISSIONS_COLLECTION),
        where('studentId', '==', studentId),
        where('exerciseId', 'in', exerciseList.map(e => e.id))
      );

      const submissions = await getDocs(submissionsQuery);
      const submissionsByExercise = submissions.docs.reduce((acc, doc) => {
        const submission = {
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate(),
          startedAt: doc.data().startedAt?.toDate(),
        } as ExerciseSubmission;
        acc[submission.exerciseId] = submission;
        return acc;
      }, {} as Record<string, ExerciseSubmission>);

      // Combinar ejercicios con submissions
      return exerciseList.map(exercise => ({
        ...exercise,
        submission: submissionsByExercise[exercise.id]
      }));
    } catch (error) {
      console.error('Error getting student exercises:', error);
      throw new Error('Failed to get student exercises');
    }
  }
}