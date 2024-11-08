'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";
import { ExerciseService } from '@/lib/services/exercise-service';
import type { Exercise, ExerciseType, ExerciseOption } from '@/types/exercise';
import { MultipleChoiceForm } from './exercise-types/multiple-choice-form';
import { FillInBlanksForm } from './exercise-types/fill-in-blanks-form';

import { MatchingForm } from './exercise-types/matching-form';
import { OrderingForm } from './exercise-types/ordering-form';

import { TranslationForm } from './exercise-types/translation-form';
import { FreeWritingForm } from './exercise-types/free-writing-form';

interface ExerciseFormProps {
  lessonId: string;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
  initialData?: Partial<Exercise>;
}

const exerciseTypes = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'fill-in-blanks', label: 'Fill in the Blanks' },
  { value: 'matching', label: 'Matching' },
  { value: 'ordering', label: 'Ordering' },
  { value: 'translation', label: 'Translation' },
  { value: 'free-writing', label: 'Free Writing' },
] as const;

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export function ExerciseForm({ lessonId, onSave, onCancel, initialData }: ExerciseFormProps) {
  const [loading, setLoading] = useState(false);
  const [exerciseType, setExerciseType] = useState<ExerciseType>(
    initialData?.type || 'multiple-choice'
  );
  const [formData, setFormData] = useState<{
    title: string;
    instructions: string;
    points: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    timeLimit: number;
    tags: string[];
    // Multiple choice
    question: string;
    options: ExerciseOption[];
    // Fill in blanks
    text: string;
    blanks: Array<{ id: string; answer: string; position: number; hint?: string }>;
    // Matching
    pairs: Array<{ id: string; left: string; right: string }>;
    // Ordering
    items: string[];
    correctOrder: number[];
    // Translation
    sourceText: string;
    targetLanguage: string;
    acceptableTranslations: string[];
    keywords?: string[];
    // Free writing
    prompt: string;
    minWords: number;
    maxWords: number;
    requiredElements?: string[];
  }>({
    title: initialData?.title || '',
    instructions: initialData?.instructions || '',
    points: initialData?.points || 10,
    difficulty: (initialData?.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
    timeLimit: initialData?.timeLimit || 0,
    tags: initialData?.tags || [],
    // Multiple choice
    question: '',
    options: [],
    // Fill in blanks
    text: '',
    blanks: [],
    // Matching
    pairs: [],
    // Ordering
    items: [],
    correctOrder: [],
    // Translation
    sourceText: '',
    targetLanguage: '',
    acceptableTranslations: [],
    keywords: [],
    // Free writing
    prompt: '',
    minWords: 0,
    maxWords: 0,
    requiredElements: [],
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear el ejercicio base
      const exerciseData = {
        type: exerciseType,
        lessonId,
        title: formData.title,
        instructions: formData.instructions,
        points: formData.points,
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit || undefined,
        tags: formData.tags,
        ...getTypeSpecificData(),
      };

      // Guardar el ejercicio
      const exerciseId = await ExerciseService.createExercise(exerciseData);
      onSave({ id: exerciseId, ...exerciseData } as Exercise);
    } catch (error) {
      console.error('Error creating exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeSpecificData = () => {
    switch (exerciseType) {
      case 'multiple-choice':
        return {
          question: formData.question,
          options: formData.options,
          allowMultiple: formData.options.filter(opt => opt.isCorrect).length > 1,
        };
      case 'fill-in-blanks':
        return {
          text: formData.text,
          blanks: formData.blanks,
        };
      case 'matching':
        return {
          pairs: formData.pairs,
        };
      case 'ordering':
        return {
          items: formData.items,
          correctOrder: formData.correctOrder,
        };
      case 'translation':
        return {
          sourceText: formData.sourceText,
          targetLanguage: formData.targetLanguage,
          acceptableTranslations: formData.acceptableTranslations,
        };
      case 'free-writing':
        return {
          prompt: formData.prompt,
          minWords: formData.minWords,
          maxWords: formData.maxWords,
        };
      default:
        return {};
    }
  };

  const getExerciseTypeContent = () => {
    switch (exerciseType) {
      case 'multiple-choice':
        return (
          <MultipleChoiceForm
            value={{
              question: formData.question,
              options: formData.options,
            }}
            onChange={(newValue) => setFormData(prev => ({
              ...prev,
              question: newValue.question,
              options: newValue.options,
            }))}
          />
        );
      case 'fill-in-blanks':
        return (
          <FillInBlanksForm
            value={{
              text: formData.text,
              blanks: formData.blanks,
            }}
            onChange={(newValue) => setFormData(prev => ({
              ...prev,
              text: newValue.text,
              blanks: newValue.blanks,
            }))}
          />
        );case 'matching':
        return (
          <MatchingForm
            value={{
              pairs: formData.pairs,
            }}
            onChange={(newValue) => setFormData(prev => ({
              ...prev,
              pairs: newValue.pairs,
            }))}
          />
        );
      case 'ordering':
        return (
          <OrderingForm
            value={{
              items: formData.items,
              correctOrder: formData.correctOrder,
            }}
            onChange={(newValue) => setFormData(prev => ({
              ...prev,
              items: newValue.items,
              correctOrder: newValue.correctOrder,
            }))}
          />
        );

        case 'translation':
      return (
        <TranslationForm
          value={{
            sourceText: formData.sourceText,
            targetLanguage: formData.targetLanguage,
            acceptableTranslations: formData.acceptableTranslations,
            keywords: formData.keywords,
          }}
          onChange={(newValue) => setFormData(prev => ({
            ...prev,
            ...newValue,
          }))}
        />
      );
    case 'free-writing':
      return (
        <FreeWritingForm
          value={{
            prompt: formData.prompt,
            minWords: formData.minWords,
            maxWords: formData.maxWords,
            requiredElements: formData.requiredElements,
          }}
          onChange={(newValue) => setFormData(prev => ({
            ...prev,
            ...newValue,
          }))}
        />
      );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Set the basic details for this exercise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Exercise Type</Label>
            <Select
              value={exerciseType}
              onValueChange={(value: ExerciseType) => setExerciseType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {exerciseTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
  value={formData.difficulty}
  onValueChange={(value: typeof formData.difficulty) => 
    setFormData(prev => ({ ...prev, difficulty: value }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select difficulty" />
  </SelectTrigger>
  <SelectContent>
    {difficultyLevels.map(level => (
      <SelectItem key={level.value} value={level.value}>
        {level.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  points: parseInt(e.target.value) || 0 
                }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (minutes, 0 for no limit)</Label>
            <Input
              id="timeLimit"
              type="number"
              min="0"
              value={formData.timeLimit}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                timeLimit: parseInt(e.target.value) || 0 
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contenido específico del tipo de ejercicio */}
      {getExerciseTypeContent()}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Exercise'}
        </Button>
      </div>
    </form>
  );
}