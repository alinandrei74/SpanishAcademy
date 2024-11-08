'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

interface MultipleChoiceFormProps {
  value: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
  };
  onChange: (value: any) => void;
}

export function MultipleChoiceForm({ value, onChange }: MultipleChoiceFormProps) {
  const handleAddOption = () => {
    onChange({
      ...value,
      options: [
        ...value.options,
        {
          id: crypto.randomUUID(),
          text: '',
          isCorrect: false,
        },
      ],
    });
  };

  const handleRemoveOption = (id: string) => {
    onChange({
      ...value,
      options: value.options.filter(opt => opt.id !== id),
    });
  };

  const handleOptionChange = (id: string, field: 'text' | 'isCorrect', newValue: any) => {
    onChange({
      ...value,
      options: value.options.map(opt =>
        opt.id === id ? { ...opt, [field]: newValue } : opt
      ),
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Question</Label>
          <Input
            value={value.question}
            onChange={(e) => onChange({ ...value, question: e.target.value })}
            placeholder="Enter your question"
          />
        </div>

        <div className="space-y-4">
          <Label>Options</Label>
          {value.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                checked={option.isCorrect}
                onCheckedChange={(checked) =>
                  handleOptionChange(option.id, 'isCorrect', checked)
                }
              />
              <Input
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(option.id, 'text', e.target.value)
                }
                placeholder="Enter option text"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(option.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddOption}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}