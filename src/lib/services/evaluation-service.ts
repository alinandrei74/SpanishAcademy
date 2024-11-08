import { 
    Exercise, 
    ExerciseResult, 
    MultipleChoiceExercise,
    FillInBlanksExercise,
    MatchingExercise,
    OrderingExercise,
    TranslationExercise
  } from '@/types/exercise';
  import { db } from '@/lib/firebase';
  import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
  
  export class EvaluationService {
    private static SUBMISSIONS_COLLECTION = 'exercise_submissions';
    private static FEEDBACK_COLLECTION = 'exercise_feedback';
  
    static async evaluateSubmission(
      exercise: Exercise,
      answer: any,
      userId: string
    ): Promise<ExerciseResult> {
      try {
        // Evaluar según el tipo de ejercicio
        const result = await this.getExerciseEvaluation(exercise, answer);
        
        // Guardar la submission
        const submission = {
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
          userId,
          answer,
          score: result.score,
          feedback: result.feedback,
          submittedAt: serverTimestamp(),
          result
        };
  
        await addDoc(collection(db, this.SUBMISSIONS_COLLECTION), submission);
  
        return result;
      } catch (error) {
        console.error('Error evaluating submission:', error);
        throw new Error('Failed to evaluate submission');
      }
    }
  
    private static async getExerciseEvaluation(
      exercise: Exercise,
      answer: any
    ): Promise<ExerciseResult> {
      switch (exercise.type) {
        case 'multiple-choice':
          return this.evaluateMultipleChoice(exercise as MultipleChoiceExercise, answer);
        case 'fill-in-blanks':
          return this.evaluateFillInBlanks(exercise as FillInBlanksExercise, answer);
        case 'matching':
          return this.evaluateMatching(exercise as MatchingExercise, answer);
        case 'ordering':
          return this.evaluateOrdering(exercise as OrderingExercise, answer);
        case 'translation':
          return this.evaluateTranslation(exercise as TranslationExercise, answer);
        case 'free-writing':
          return this.createPendingEvaluation(exercise);
      }
    }
  
    private static evaluateMultipleChoice(
      exercise: MultipleChoiceExercise,
      selectedOptions: string[]
    ): ExerciseResult {
      const correctOptions = exercise.options.filter(opt => opt.isCorrect).map(opt => opt.id);
      const isCorrect = this.arraysEqual(selectedOptions.sort(), correctOptions.sort());
      const partialCredit = selectedOptions.filter(opt => correctOptions.includes(opt)).length;
      const score = isCorrect ? exercise.points : (partialCredit / correctOptions.length) * exercise.points;
  
      return {
        correct: isCorrect,
        score: Math.round(score * 10) / 10,
        details: {
          correctAnswers: partialCredit,
          totalQuestions: correctOptions.length,
        },
        feedback: this.generateFeedback(isCorrect, score, exercise.points)
      };
    }
  
    private static evaluateFillInBlanks(
      exercise: FillInBlanksExercise,
      answers: Record<string, string>
    ): ExerciseResult {
      const correctAnswers = exercise.blanks.filter(blank => 
        this.normalizeAnswer(answers[blank.id]) === this.normalizeAnswer(blank.answer)
      ).length;
  
      const score = (correctAnswers / exercise.blanks.length) * exercise.points;
  
      return {
        correct: correctAnswers === exercise.blanks.length,
        score: Math.round(score * 10) / 10,
        details: {
          correctAnswers,
          totalQuestions: exercise.blanks.length,
          incorrectItems: exercise.blanks
            .filter(blank => this.normalizeAnswer(answers[blank.id]) !== this.normalizeAnswer(blank.answer))
            .map(blank => blank.id)
        },
        feedback: this.generateFeedback(correctAnswers === exercise.blanks.length, score, exercise.points)
      };
    }
  
    private static evaluateMatching(
      exercise: MatchingExercise,
      matches: Record<string, string>
    ): ExerciseResult {
      const correctMatches = exercise.pairs.filter(pair => 
        matches[pair.left] === pair.right
      ).length;
  
      const score = (correctMatches / exercise.pairs.length) * exercise.points;
  
      return {
        correct: correctMatches === exercise.pairs.length,
        score: Math.round(score * 10) / 10,
        details: {
          correctAnswers: correctMatches,
          totalQuestions: exercise.pairs.length,
        },
        feedback: this.generateFeedback(correctMatches === exercise.pairs.length, score, exercise.points)
      };
    }
  
    private static evaluateOrdering(
      exercise: OrderingExercise,
      order: number[]
    ): ExerciseResult {
      const correctPositions = order.filter((item, index) => 
        item === exercise.correctOrder[index]
      ).length;
  
      const score = (correctPositions / order.length) * exercise.points;
  
      return {
        correct: correctPositions === order.length,
        score: Math.round(score * 10) / 10,
        details: {
          correctAnswers: correctPositions,
          totalQuestions: order.length,
        },
        feedback: this.generateFeedback(correctPositions === order.length, score, exercise.points)
      };
    }
  
    private static evaluateTranslation(
      exercise: TranslationExercise,
      translation: string
    ): ExerciseResult {
      const normalizedTranslation = this.normalizeAnswer(translation);
      const acceptableTranslations = exercise.acceptableTranslations.map(t => 
        this.normalizeAnswer(t)
      );
  
      const isExactMatch = acceptableTranslations.includes(normalizedTranslation);
      let score = isExactMatch ? exercise.points : 0;
  
      // Evaluación por keywords si no hay coincidencia exacta
      if (!isExactMatch && exercise.keywords) {
        const keywordsFound = exercise.keywords.filter(keyword =>
          normalizedTranslation.includes(this.normalizeAnswer(keyword))
        ).length;
        score = (keywordsFound / exercise.keywords.length) * exercise.points * 0.8; // 80% máximo por keywords
      }
  
      return {
        correct: isExactMatch,
        score: Math.round(score * 10) / 10,
        details: {
          correctAnswers: isExactMatch ? 1 : 0,
          totalQuestions: 1,
          suggestions: isExactMatch ? undefined : exercise.acceptableTranslations
        },
        feedback: this.generateTranslationFeedback(isExactMatch, score, exercise)
      };
    }
  
    private static createPendingEvaluation(exercise: Exercise): ExerciseResult {
      return {
        correct: false,
        score: 0,
        details: {
          correctAnswers: 0,
          totalQuestions: 1,
          pending: true
        },
        feedback: "This submission requires teacher review. Your score will be updated once reviewed."
      };
    }
  
    private static normalizeAnswer(text: string): string {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[.,!?;:'"]/g, '');
    }
  
    private static arraysEqual(a: any[], b: any[]): boolean {
      if (a.length !== b.length) return false;
      return a.every((val, index) => val === b[index]);
    }
  
    private static generateFeedback(isCorrect: boolean, score: number, totalPoints: number): string {
      if (isCorrect) {
        return "Perfect! You got everything correct.";
      }
      
      const percentage = (score / totalPoints) * 100;
      if (percentage >= 80) {
        return "Great work! Just a few minor mistakes.";
      } else if (percentage >= 60) {
        return "Good effort! There's room for improvement.";
      } else if (percentage >= 40) {
        return "Keep practicing! Review the topics and try again.";
      } else {
        return "You might want to review the material before trying again.";
      }
    }
  
    private static generateTranslationFeedback(
      isExactMatch: boolean,
      score: number,
      exercise: Exercise
    ): string {
      if (isExactMatch) {
        return "Perfect translation!";
      }
      
      const percentage = (score / exercise.points) * 100;
      if (percentage >= 80) {
        return "Very good translation! You captured most of the key elements.";
      } else if (percentage >= 60) {
        return "Good attempt! Consider the suggested translations for improvement.";
      } else {
        return "Review the suggested translations and key vocabulary.";
      }
    }
  }