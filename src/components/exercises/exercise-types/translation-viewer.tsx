'use client';

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Languages, Volume2 } from "lucide-react";
import type { TranslationExercise } from "@/types/exercise";

interface TranslationViewerProps {
  exercise: TranslationExercise;
  value: string;
  onChange: (value: string) => void;
  isSubmitted?: boolean;
  feedback?: string;
}

export function TranslationViewer({
  exercise,
  value,
  onChange,
  isSubmitted,
  feedback
}: TranslationViewerProps) {
  const targetLanguageLabel = (() => {
    const langMap: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese'
    };
    return langMap[exercise.targetLanguage] || exercise.targetLanguage;
  })();

  return (
    <div className="space-y-6">
      {/* Source text */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <CardDescription className="mb-2">Source Text:</CardDescription>
              <div className="text-lg">{exercise.sourceText}</div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              title="Listen to text"
              onClick={() => {
                // Aquí se implementaría la funcionalidad de texto a voz
                console.log('Text-to-speech not implemented');
              }}
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Translation input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-muted-foreground" />
          <span>Translate to {targetLanguageLabel}</span>
        </div>
        
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter your translation in ${targetLanguageLabel}`}
          className="min-h-[150px]"
          disabled={isSubmitted}
        />
      </div>

      {/* Feedback when submitted */}
      {isSubmitted && (
        <div className="space-y-4">
          <Card className={value === exercise.acceptableTranslations[0] 
            ? "bg-green-50 border-green-200" 
            : "bg-yellow-50 border-yellow-200"
          }>
            <CardContent className="pt-6">
              <CardDescription className="mb-2">Suggested Translation:</CardDescription>
              <div className="text-lg">{exercise.acceptableTranslations[0]}</div>
              {exercise.keywords && (
                <div className="mt-4">
                  <CardDescription>Key elements to include:</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exercise.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-sm ${
                          value.toLowerCase().includes(keyword.toLowerCase())
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {feedback && (
            <div className="p-4 bg-secondary rounded-lg">
              <p className="font-medium">Feedback:</p>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}