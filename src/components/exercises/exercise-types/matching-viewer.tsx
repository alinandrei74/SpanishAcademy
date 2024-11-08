'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import type { MatchingExercise } from "@/types/exercise";

interface MatchingViewerProps {
  exercise: MatchingExercise;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  isSubmitted?: boolean;
  feedback?: string;
}

export function MatchingViewer({
  exercise,
  value,
  onChange,
  isSubmitted,
  feedback
}: MatchingViewerProps) {
  // Mezclar las opciones de la derecha
  const [shuffledRightItems] = useState(() => {
    const items = exercise.pairs.map(pair => ({ id: pair.id, text: pair.right }));
    return items.sort(() => Math.random() - 0.5);
  });

  const handleMatch = (leftId: string, rightId: string) => {
    onChange({
      ...value,
      [leftId]: rightId
    });
  };

  const isCorrectMatch = (leftId: string, rightId: string) => {
    const pair = exercise.pairs.find(p => p.id === leftId);
    return pair?.right === rightId;
  };

  return (
    <div className="space-y-6">
      {exercise.pairs.map((pair) => {
        const selectedRightId = value[pair.id];
        const isCorrect = isSubmitted && isCorrectMatch(pair.id, selectedRightId);

        return (
          <div 
            key={pair.id}
            className={`flex items-center gap-4 p-4 rounded-lg border ${
              isSubmitted
                ? isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
                : ''
            }`}
          >
            <div className="flex-1 font-medium">
              {pair.left}
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground" />

            <div className="flex-1">
              <Select
                value={selectedRightId}
                onValueChange={(value) => handleMatch(pair.id, value)}
                disabled={isSubmitted}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select match" />
                </SelectTrigger>
                <SelectContent>
                  {shuffledRightItems.map((item) => (
                    <SelectItem key={item.id} value={item.text}>
                      {item.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isSubmitted && (
              <div className="w-6">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        );
      })}

      {isSubmitted && feedback && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <p className="font-medium">Feedback:</p>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}