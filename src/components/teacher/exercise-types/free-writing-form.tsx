'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

interface FreeWritingFormProps {
  value: {
    prompt: string;
    minWords?: number;
    maxWords?: number;
    requiredElements?: string[];
  };
  onChange: (value: any) => void;
}

export function FreeWritingForm({ value, onChange }: FreeWritingFormProps) {
  const handleAddElement = () => {
    onChange({
      ...value,
      requiredElements: [...(value.requiredElements || []), ''],
    });
  };

  const handleRemoveElement = (index: number) => {
    const newElements = (value.requiredElements || []).filter((_, i) => i !== index);
    onChange({
      ...value,
      requiredElements: newElements,
    });
  };

  const handleElementChange = (index: number, newValue: string) => {
    const newElements = [...(value.requiredElements || [])];
    newElements[index] = newValue;
    onChange({
      ...value,
      requiredElements: newElements,
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label>Writing Prompt</Label>
          <Textarea
            value={value.prompt}
            onChange={(e) => onChange({ ...value, prompt: e.target.value })}
            placeholder="Enter the writing prompt"
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Minimum Words</Label>
            <Input
              type="number"
              min="0"
              value={value.minWords || 0}
              onChange={(e) => onChange({ 
                ...value, 
                minWords: parseInt(e.target.value) || 0 
              })}
              placeholder="Minimum words required"
            />
          </div>

          <div className="space-y-2">
            <Label>Maximum Words</Label>
            <Input
              type="number"
              min="0"
              value={value.maxWords || 0}
              onChange={(e) => onChange({ 
                ...value, 
                maxWords: parseInt(e.target.value) || 0 
              })}
              placeholder="Maximum words allowed"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Required Elements</Label>
          {(value.requiredElements || []).map((element, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={element}
                  onChange={(e) => handleElementChange(index, e.target.value)}
                  placeholder={`Element ${index + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveElement(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddElement}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Required Element
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}