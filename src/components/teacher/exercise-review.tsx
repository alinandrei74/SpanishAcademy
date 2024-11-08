'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Exercise, ExerciseSubmission } from '@/types/exercise';

type AnnotationType = 'correction' | 'suggestion' | 'praise';

interface Annotation {
  text: string;
  type: AnnotationType;
}

interface ExerciseReviewProps {
  exercise: Exercise;
  submission: ExerciseSubmission;
  onReviewSubmit: (review: {
    score: number;
    feedback: string;
    rubricScores?: Record<string, number>;
    annotations?: Annotation[];
  }) => Promise<void>;
}

interface RubricItem {
  id: string;
  name: string;
  maxPoints: number;
  criteria: string[];
}

const DEFAULT_RUBRIC: RubricItem[] = [
  {
    id: 'content',
    name: 'Content',
    maxPoints: 10,
    criteria: [
      'Addresses all aspects of the prompt',
      'Ideas are well-developed and supported',
      'Shows understanding of the topic'
    ]
  },
  {
    id: 'organization',
    name: 'Organization',
    maxPoints: 10,
    criteria: [
      'Clear structure',
      'Logical flow of ideas',
      'Effective transitions'
    ]
  },
  {
    id: 'language',
    name: 'Language Use',
    maxPoints: 10,
    criteria: [
      'Appropriate vocabulary',
      'Grammatical accuracy',
      'Sentence variety'
    ]
  }
];

export function ExerciseReview({
  exercise,
  submission,
  onReviewSubmit
}: ExerciseReviewProps) {
  const [feedback, setFeedback] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [newAnnotation, setNewAnnotation] = useState<Annotation>({
    text: '',
    type: 'correction'
  });

  const calculateTotalScore = () => {
    if (Object.keys(rubricScores).length === 0) return 0;
    const total = Object.values(rubricScores).reduce((sum, score) => sum + score, 0);
    const maxPossible = DEFAULT_RUBRIC.reduce((sum, item) => sum + item.maxPoints, 0);
    return (total / maxPossible) * exercise.points;
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.text.trim()) {
      setAnnotations([...annotations, { ...newAnnotation }]);
      setNewAnnotation({ text: '', type: 'correction' });
    }
  };

  const handleSubmitReview = async () => {
    const review = {
      score: calculateTotalScore(),
      feedback,
      rubricScores,
      annotations
    };
    await onReviewSubmit(review);
  };

  return (
    <div className="space-y-6">
      {/* Original Submission */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submission</CardTitle>
          <CardDescription>
            Submitted on {submission.submittedAt.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{submission.answer}</div>
        </CardContent>
      </Card>

      {/* Rubric Evaluation */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Rubric</CardTitle>
          <CardDescription>Score each criteria category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DEFAULT_RUBRIC.map((item) => (
            <div key={item.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{item.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {rubricScores[item.id] || 0} / {item.maxPoints}
                </span>
              </div>
              <Slider
                value={[rubricScores[item.id] || 0]}
                onValueChange={([value]) => 
                  setRubricScores(prev => ({ ...prev, [item.id]: value }))
                }
                max={item.maxPoints}
                step={1}
              />
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {item.criteria.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-4 text-right">
            <p className="text-lg font-medium">
              Total Score: {Math.round(calculateTotalScore())} / {exercise.points}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Annotations */}
      <Card>
        <CardHeader>
          <CardTitle>Annotations</CardTitle>
          <CardDescription>Add specific comments and corrections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select
                value={newAnnotation.type}
                onValueChange={(value: AnnotationType) => 
                  setNewAnnotation(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correction">Correction</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="praise">Praise</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={newAnnotation.text}
                onChange={(e) => setNewAnnotation(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter annotation"
                className="flex-1"
              />
              <Button onClick={handleAddAnnotation}>Add</Button>
            </div>

            <div className="space-y-2">
              {annotations.map((annotation, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    annotation.type === 'correction' 
                      ? 'bg-red-50 border-red-200'
                      : annotation.type === 'suggestion'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
                  } border`}
                >
                  <span className="font-medium capitalize">{annotation.type}: </span>
                  {annotation.text}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Feedback</CardTitle>
          <CardDescription>Provide comprehensive feedback to the student</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmitReview}>
          Submit Review
        </Button>
      </div>
    </div>
  );
}