// Propiedades comunes para todos los ejercicios
export interface BaseExercise {
  id: string;
  title: string;
  instructions: string;
  type: ExerciseType;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number;
  tags?: string[];
}

export type ExerciseType = 
  | 'multiple-choice'
  | 'fill-in-blanks'
  | 'matching'
  | 'ordering'
  | 'translation'
  | 'free-writing';

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ExerciseBlank {
  id: string;
  answer: string;
  position: number;
  hint?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  question: string;      // Añadida esta línea
  options: ExerciseOption[];
  allowMultiple: boolean;
}

export interface FillInBlanksExercise extends BaseExercise {
  type: 'fill-in-blanks';
  text: string;
  blanks: ExerciseBlank[];
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: MatchingPair[];
}

export interface OrderingExercise extends BaseExercise {
  type: 'ordering';
  items: string[];
  correctOrder: number[];
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation';
  sourceText: string;
  targetLanguage: string;
  acceptableTranslations: string[];
  keywords?: string[];
}

export interface FreeWritingExercise extends BaseExercise {
  type: 'free-writing';
  prompt: string;
  minWords?: number;
  maxWords?: number;
  requiredElements?: string[];
}

// Tipo unión que representa cualquier tipo de ejercicio
export type Exercise =
  | MultipleChoiceExercise
  | FillInBlanksExercise
  | MatchingExercise
  | OrderingExercise
  | TranslationExercise
  | FreeWritingExercise;

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  studentId: string;
  answer: any;
  score: number;
  feedback?: string;
  startedAt: Date;
  submittedAt: Date;
  timeSpent: number;
  attempts: number;
}

export interface ExerciseResult {
  correct: boolean;
  score: number;
  details: {
    correctAnswers: number;
    totalQuestions: number;
    incorrectItems?: string[];
    suggestions?: string[];
    pending?: boolean;
  };
  feedback?: string;
}