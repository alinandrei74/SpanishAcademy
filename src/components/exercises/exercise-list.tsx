"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, Edit, Plus, Lock } from "lucide-react";
import { ExerciseForm } from "../teacher/exercise-form";
import { ExerciseViewer } from "./exercise-viewer";
import type { Exercise, ExerciseSubmission } from "@/types/exercise";

interface ExerciseListProps {
  lessonId: string;
  exercises: Exercise[];
  submissions?: Record<string, ExerciseSubmission>;
  isTeacher?: boolean;
  onExerciseUpdate?: (exercise: Exercise) => void;
  onSubmit?: (exerciseId: string, answer: any) => Promise<void>;
}

export function ExerciseList({
  lessonId,
  exercises,
  submissions,
  isTeacher = false,
  onExerciseUpdate,
  onSubmit,
}: ExerciseListProps) {
  const [showNewExerciseDialog, setShowNewExerciseDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const handleSaveExercise = (exercise: Exercise) => {
    onExerciseUpdate?.(exercise);
    setShowNewExerciseDialog(false);
    setEditingExercise(null);
  };

  const calculateProgress = () => {
    if (!submissions || exercises.length === 0) return 0;
    const completedCount = Object.keys(submissions).length;
    return (completedCount / exercises.length) * 100;
  };

  const getTotalPoints = () => {
    return exercises.reduce((total, exercise) => total + exercise.points, 0);
  };

  const getEarnedPoints = () => {
    if (!submissions) return 0;
    return Object.values(submissions).reduce(
      (total, submission) => total + (submission.score || 0),
      0
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">
                  {Math.round(calculateProgress())}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold">
                  {getEarnedPoints()} / {getTotalPoints()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="text-2xl font-bold">
                  {exercises.reduce(
                    (total, ex) => total + (ex.timeLimit || 0),
                    0
                  )}{" "}
                  min
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Exercises</h2>
          {isTeacher && (
            <Dialog
              open={showNewExerciseDialog}
              onOpenChange={setShowNewExerciseDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Exercise</DialogTitle>
                  <DialogDescription>
                    Add a new exercise to this lesson
                  </DialogDescription>
                </DialogHeader>
                <ExerciseForm
                  lessonId={lessonId}
                  onSave={handleSaveExercise}
                  onCancel={() => setShowNewExerciseDialog(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {exercises.map((exercise) => {
            const submission = submissions?.[exercise.id];
            const isCompleted = !!submission;
            const isLocked = false; // Implementar lógica de bloqueo según requisitos

            return (
              <AccordionItem
                key={exercise.id}
                value={exercise.id}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-6">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      {isLocked && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="text-left">
                        <h3 className="font-medium">{exercise.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.type.replace("-", " ")} • {exercise.points}{" "}
                          points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={isCompleted ? "default" : "secondary"}>
                        {isCompleted ? "Completed" : "Pending"}
                      </Badge>
                      {exercise.timeLimit && (
                        <Badge variant="outline">
                          {exercise.timeLimit} min
                        </Badge>
                      )}
                      <Badge
                        variant={
                          (
                            {
                              beginner: "default",
                              intermediate: "outline",
                              advanced: "destructive",
                            } as const
                          )[exercise.difficulty] || "default"
                        }
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4">
                  {isTeacher ? (
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        onClick={() => setEditingExercise(exercise)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Exercise
                      </Button>
                    </div>
                  ) : null}
                  <ExerciseViewer
                    exercise={exercise}
                    submission={submission}
                    onSubmit={async (answer) => {
                      if (onSubmit) {
                        await onSubmit(exercise.id, answer);
                      }
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Edit Exercise Dialog */}
      {editingExercise && (
        <Dialog open={true} onOpenChange={() => setEditingExercise(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Exercise</DialogTitle>
              <DialogDescription>Modify the exercise details</DialogDescription>
            </DialogHeader>
            <ExerciseForm
              lessonId={lessonId}
              initialData={editingExercise}
              onSave={handleSaveExercise}
              onCancel={() => setEditingExercise(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
