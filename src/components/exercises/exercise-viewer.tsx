'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, BookOpen, CheckCircle } from "lucide-react";
import type { Exercise, ExerciseSubmission } from '@/types/exercise';
import { MultipleChoiceViewer } from './exercise-types/multiple-choice-viewer';
import { FillInBlanksViewer } from './exercise-types/fill-in-blanks-viewer';
import { MatchingViewer } from './exercise-types/matching-viewer';
import { OrderingViewer } from './exercise-types/ordering-viewer';
import { TranslationViewer } from './exercise-types/translation-viewer';
import { FreeWritingViewer } from './exercise-types/free-writing-viewer';

interface ExerciseViewerProps {
  exercise: Exercise;
  onSubmit: (answer: any) => Promise<void>;
  initialAnswer?: any;
  submission?: ExerciseSubmission;
}

export function ExerciseViewer({
  exercise,
  onSubmit,
  initialAnswer,
  submission
}: ExerciseViewerProps) {
  const [answer, setAnswer] = useState<any>(initialAnswer || {});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState((exercise.timeLimit || 0) * 60);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(answer);
    } catch (error) {
      console.error('Error submitting exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExerciseContent = () => {
    const commonProps = {
      value: answer,
      onChange: setAnswer,
      isSubmitted: !!submission,
      feedback: submission?.feedback,
    };

    switch (exercise.type) {
      case 'multiple-choice':
        return <MultipleChoiceViewer exercise={exercise} {...commonProps} />;
      case 'fill-in-blanks':
        return <FillInBlanksViewer exercise={exercise} {...commonProps} />;
      case 'matching':
        return <MatchingViewer exercise={exercise} {...commonProps} />;
      case 'ordering':
        return <OrderingViewer exercise={exercise} {...commonProps} />;
      case 'translation':
        return <TranslationViewer exercise={exercise} {...commonProps} />;
      case 'free-writing':
        return <FreeWritingViewer exercise={exercise} {...commonProps} />;
      default:
        return <p>Unsupported exercise type</p>;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{exercise.title}</CardTitle>
            <CardDescription>{exercise.instructions}</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {(exercise.timeLimit || 0) > 0 && (
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{exercise.points} points</span>
            </div>
          </div>
        </div>

        {/* Difficulty indicator */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm font-medium">Difficulty:</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            {
              'beginner': 'bg-green-100 text-green-800',
              'intermediate': 'bg-yellow-100 text-yellow-800',
              'advanced': 'bg-red-100 text-red-800'
            }[exercise.difficulty]
          }`}>
            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {getExerciseContent()}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        {submission ? (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Score:</span>
              <span className="text-lg font-bold">
                {submission.score || 0} / {exercise.points}
              </span>
            </div>
            <Progress value={((submission.score || 0) / exercise.points) * 100} />
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Submitting...' : 'Submit Answer'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}