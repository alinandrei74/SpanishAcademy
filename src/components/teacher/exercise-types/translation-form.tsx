'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TranslationFormProps {
  value: {
    sourceText: string;
    targetLanguage: string;
    acceptableTranslations: string[];
    keywords?: string[];
  };
  onChange: (value: any) => void;
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
];

export function TranslationForm({ value, onChange }: TranslationFormProps) {
  const handleAddTranslation = () => {
    onChange({
      ...value,
      acceptableTranslations: [...value.acceptableTranslations, ''],
    });
  };

  const handleRemoveTranslation = (index: number) => {
    const newTranslations = value.acceptableTranslations.filter((_, i) => i !== index);
    onChange({
      ...value,
      acceptableTranslations: newTranslations,
    });
  };

  const handleTranslationChange = (index: number, newValue: string) => {
    const newTranslations = [...value.acceptableTranslations];
    newTranslations[index] = newValue;
    onChange({
      ...value,
      acceptableTranslations: newTranslations,
    });
  };

  const handleAddKeyword = () => {
    onChange({
      ...value,
      keywords: [...(value.keywords || []), ''],
    });
  };

  const handleRemoveKeyword = (index: number) => {
    const newKeywords = (value.keywords || []).filter((_, i) => i !== index);
    onChange({
      ...value,
      keywords: newKeywords,
    });
  };

  const handleKeywordChange = (index: number, newValue: string) => {
    const newKeywords = [...(value.keywords || [])];
    newKeywords[index] = newValue;
    onChange({
      ...value,
      keywords: newKeywords,
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label>Source Text</Label>
          <Textarea
            value={value.sourceText}
            onChange={(e) => onChange({ ...value, sourceText: e.target.value })}
            placeholder="Enter the text to be translated"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Target Language</Label>
          <Select
            value={value.targetLanguage}
            onValueChange={(newValue) => onChange({ ...value, targetLanguage: newValue })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Acceptable Translations</Label>
          {value.acceptableTranslations.map((translation, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={translation}
                  onChange={(e) => handleTranslationChange(index, e.target.value)}
                  placeholder={`Translation ${index + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveTranslation(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTranslation}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Translation
          </Button>
        </div>

        <div className="space-y-4">
          <Label>Keywords (Optional)</Label>
          {(value.keywords || []).map((keyword, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={keyword}
                  onChange={(e) => handleKeywordChange(index, e.target.value)}
                  placeholder={`Keyword ${index + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveKeyword(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddKeyword}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}