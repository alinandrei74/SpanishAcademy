'use client';

import { CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { MultipleChoiceExercise } from "@/types/exercise";

interface MultipleChoiceViewerProps {
  exercise: MultipleChoiceExercise;
  value: string[];
  onChange: (value: string[]) => void;
  isSubmitted?: boolean;
  feedback?: string;
}

export function MultipleChoiceViewer({
  exercise,
  value,
  onChange,
  isSubmitted,
  feedback
}: MultipleChoiceViewerProps) {
  const handleChange = (optionId: string, checked: boolean) => {
    if (exercise.allowMultiple) {
      onChange(
        checked
          ? [...value, optionId]
          : value.filter(id => id !== optionId)
      );
    } else {
      onChange([optionId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">{exercise.question}</div>
      <div className="space-y-4">
        {exercise.options.map((option) => {
          const isSelected = value.includes(option.id);
          const isCorrect = option.isCorrect;
          const showFeedback = isSubmitted && isSelected;

          return (
            <div
              key={option.id}
              className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                isSubmitted
                  ? isSelected && isCorrect
                    ? 'bg-green-50 border-green-200'
                    : isSelected
                    ? 'bg-red-50 border-red-200'
                    : ''
                  : isSelected
                  ? 'bg-secondary'
                  : ''
              }`}
            >
              {exercise.allowMultiple ? (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleChange(option.id, !!checked)}
                  disabled={isSubmitted}
                />
              ) : (
                <RadioGroup
                  value={value[0]}
                  onValueChange={(value) => handleChange(value, true)}
                  disabled={isSubmitted}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                  </div>
                </RadioGroup>
              )}
              <Label htmlFor={option.id} className="flex-1">
                {option.text}
              </Label>
              {showFeedback && (
                isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )
              )}
            </div>
          );
        })}
      </div>
      {isSubmitted && feedback && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <p className="font-medium">Feedback:</p>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}