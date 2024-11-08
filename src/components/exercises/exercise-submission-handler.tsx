'use client';

import { useState } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { EvaluationService } from '@/lib/services/evaluation-service';
import { ExerciseViewer } from './exercise-viewer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Exercise, ExerciseResult } from '@/types/exercise';

interface ExerciseSubmissionHandlerProps {
  exercise: Exercise;
  onSubmitted?: (result: ExerciseResult) => void;
}

export function ExerciseSubmissionHandler({
  exercise,
  onSubmitted
}: ExerciseSubmissionHandlerProps) {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExerciseResult | null>(null);

  const handleSubmit = async (answer: any) => {
    if (!user) {
      setError('You must be logged in to submit exercises');
      return;
    }

    try {
      setError(null);
      const submissionResult = await EvaluationService.evaluateSubmission(
        exercise,
        answer,
        user.uid
      );
      setResult(submissionResult);
      onSubmitted?.(submissionResult);
    } catch (err: any) {
      setError(err.message || 'Failed to submit exercise');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ExerciseViewer
        exercise={exercise}
        onSubmit={handleSubmit}
        submission={result ? {
            id: crypto.randomUUID(), // Añadir id único
            exerciseId: exercise.id,
            studentId: user?.uid || '',
            answer: null,
            score: result.score,
            feedback: result.feedback,
            startedAt: new Date(),
            submittedAt: new Date(),
            timeSpent: 0,
            attempts: 1,
          } : undefined}
      />
    </div>
  );
}