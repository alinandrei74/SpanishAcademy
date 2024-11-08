'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonMaterials } from "./lesson-materials";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonForm } from "./lesson-form";
import type { Lesson } from "@/types/lesson";
import { LessonService } from "@/lib/services/lesson-service";

interface LessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId?: string;
  studentId?: string;
  initialData?: Partial<Lesson>;
  onSaved?: () => void;
}

export function LessonDialog({
  open,
  onOpenChange,
  lessonId,
  studentId,
  initialData,
  onSaved,
}: LessonDialogProps) {
  const handleSave = async (lessonData: Partial<Lesson>) => {
    try {
      if (lessonId) {
        await LessonService.updateLesson(lessonId, lessonData);
      } else {
        await LessonService.createLesson(lessonData as Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>);
      }
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lessonId ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
          <DialogDescription>
            {lessonId 
              ? 'Update the lesson details below'
              : 'Fill in the details to create a new lesson'
            }
          </DialogDescription>
        </DialogHeader>
        <LessonForm
          lessonId={lessonId}
          initialData={initialData}
          studentId={studentId}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
        <Tabs defaultValue="details" className="mt-6">
  <TabsList>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="materials">Materials</TabsTrigger>
  </TabsList>
  <TabsContent value="details">
    <LessonForm
      lessonId={lessonId}
      initialData={initialData}
      studentId={studentId}
      onSave={handleSave}
      onCancel={() => onOpenChange(false)}
    />
  </TabsContent>
  <TabsContent value="materials">
    {lessonId ? (
      <LessonMaterials
        lessonId={lessonId}
        materials={initialData?.materials || []}
        onUpdate={(materials) => {
          if (initialData) {
            initialData.materials = materials;
          }
        }}
      />
    ) : (
      <p className="text-center py-4 text-muted-foreground">
        Save the lesson first to add materials
      </p>
    )}
  </TabsContent>
</Tabs>
      </DialogContent>
    </Dialog>
  );
}