'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

interface FillInBlanksFormProps {
  value: {
    text: string;
    blanks: Array<{
      id: string;
      answer: string;
      position: number;
      hint?: string;
    }>;
  };
  onChange: (value: any) => void;
}

export function FillInBlanksForm({ value, onChange }: FillInBlanksFormProps) {
  const handleAddBlank = () => {
    onChange({
      ...value,
      blanks: [
        ...value.blanks,
        {
          id: crypto.randomUUID(),
          answer: '',
          position: value.blanks.length,
          hint: '',
        },
      ],
    });
  };

  const handleRemoveBlank = (id: string) => {
    onChange({
      ...value,
      blanks: value.blanks
        .filter(blank => blank.id !== id)
        .map((blank, index) => ({ ...blank, position: index })),
    });
  };

  const handleBlankChange = (id: string, field: string, newValue: any) => {
    onChange({
      ...value,
      blanks: value.blanks.map(blank =>
        blank.id === id ? { ...blank, [field]: newValue } : blank
      ),
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Text</Label>
          <Textarea
            value={value.text}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            placeholder="Enter the text with _____ for blanks"
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            Use _____ (5 underscores) to mark where blanks should appear
          </p>
        </div>

        <div className="space-y-4">
          <Label>Blanks</Label>
          {value.blanks.map((blank, index) => (
            <div key={blank.id} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Blank #{index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveBlank(blank.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Answer</Label>
                <Input
                  value={blank.answer}
                  onChange={(e) =>
                    handleBlankChange(blank.id, 'answer', e.target.value)
                  }
                  placeholder="Correct answer"
                />
              </div>

              <div className="space-y-2">
                <Label>Hint (optional)</Label>
                <Input
                  value={blank.hint}
                  onChange={(e) =>
                    handleBlankChange(blank.id, 'hint', e.target.value)
                  }
                  placeholder="Hint for this blank"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddBlank}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Blank
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}