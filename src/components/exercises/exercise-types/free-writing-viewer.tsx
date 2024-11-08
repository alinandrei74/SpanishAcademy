'use client';

import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { AlignLeft, Check } from "lucide-react";
import type { FreeWritingExercise } from "@/types/exercise";

interface FreeWritingViewerProps {
  exercise: FreeWritingExercise;
  value: string;
  onChange: (value: string) => void;
  isSubmitted?: boolean;
  feedback?: string;
}

export function FreeWritingViewer({
  exercise,
  value,
  onChange,
  isSubmitted,
  feedback
}: FreeWritingViewerProps) {
  const [wordCount, setWordCount] = useState(0);
  const [requiredElementsStatus, setRequiredElementsStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Contar palabras
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    // Verificar elementos requeridos
    if (exercise.requiredElements) {
      const status: Record<string, boolean> = {};
      exercise.requiredElements.forEach(element => {
        status[element] = value.toLowerCase().includes(element.toLowerCase());
      });
      setRequiredElementsStatus(status);
    }
  }, [value, exercise.requiredElements]);

  const isWithinWordLimits = (
    (!exercise.minWords || wordCount >= exercise.minWords) &&
    (!exercise.maxWords || wordCount <= exercise.maxWords)
  );

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <Card>
        <CardContent className="pt-6">
          <CardDescription className="mb-2">Writing Prompt:</CardDescription>
          <div className="text-lg">{exercise.prompt}</div>
        </CardContent>
      </Card>

      {/* Writing requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <CardDescription>Word Count</CardDescription>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-lg font-medium ${
                isWithinWordLimits ? 'text-green-600' : 'text-red-600'
              }`}>
                {wordCount} words
              </span>
              {exercise.minWords && (
                <span className="text-sm text-muted-foreground">
                  (min: {exercise.minWords})
                </span>
              )}
              {exercise.maxWords && (
                <span className="text-sm text-muted-foreground">
                  (max: {exercise.maxWords})
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {exercise.requiredElements && exercise.requiredElements.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <CardDescription>Required Elements</CardDescription>
              <div className="mt-2 space-y-2">
                {exercise.requiredElements.map((element, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    {requiredElementsStatus[element] ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 border rounded-full" />
                    )}
                    <span>{element}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Writing area */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlignLeft className="h-5 w-5 text-muted-foreground" />
          <span>Your Response</span>
        </div>
        
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your response here..."
          className="min-h-[300px]"
          disabled={isSubmitted}
        />
      </div>

      {/* Feedback when submitted */}
      {isSubmitted && feedback && (
        <Alert>
          <AlertDescription className="whitespace-pre-wrap">{feedback}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}