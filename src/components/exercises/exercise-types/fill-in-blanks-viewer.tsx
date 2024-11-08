'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import type { FillInBlanksExercise } from "@/types/exercise";

interface FillInBlanksViewerProps {
  exercise: FillInBlanksExercise;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  isSubmitted?: boolean;
  feedback?: string;
}

export function FillInBlanksViewer({
  exercise,
  value,
  onChange,
  isSubmitted,
  feedback
}: FillInBlanksViewerProps) {
  const handleChange = (blankId: string, blankValue: string) => {
    onChange({
      ...value,
      [blankId]: blankValue
    });
  };

  const formatText = () => {
    let formattedText = exercise.text;
    exercise.blanks.forEach((blank, index) => {
      const blankValue = value[blank.id] || '';
      const isCorrect = isSubmitted && blankValue.toLowerCase() === blank.answer.toLowerCase();
      const inputElement = `
        <div class="inline-block min-w-[100px] align-bottom">
          <input
            type="text"
            class="w-full px-2 py-1 border rounded-md text-center ${
              isSubmitted
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-input'
            }"
            value="${blankValue}"
            data-blank-id="${blank.id}"
            ${isSubmitted ? 'disabled' : ''}
          />
          ${isSubmitted ? `
            <div class="text-xs mt-1 text-center ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }">
              Correct: ${blank.answer}
            </div>
          ` : ''}
        </div>
      `;
      formattedText = formattedText.replace('_____', inputElement);
    });
    return formattedText;
  };

  return (
    <div className="space-y-6">
      <div 
        className="prose prose-blue max-w-none space-y-4"
        dangerouslySetInnerHTML={{ __html: formatText() }}
        onClick={(e) => {
          const input = (e.target as HTMLElement).closest('input');
          if (input && !isSubmitted) {
            const blankId = input.getAttribute('data-blank-id');
            if (blankId) {
              handleChange(blankId, (input as HTMLInputElement).value);
            }
          }
        }}
        onInput={(e) => {
          const input = (e.target as HTMLElement).closest('input');
          if (input && !isSubmitted) {
            const blankId = input.getAttribute('data-blank-id');
            if (blankId) {
              handleChange(blankId, (input as HTMLInputElement).value);
            }
          }
        }}
      />

      {isSubmitted && feedback && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <p className="font-medium">Feedback:</p>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}