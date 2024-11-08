'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { LessonService } from '@/lib/services/lesson-service';
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
import type { Lesson, LessonType, ProficiencyLevel, LessonObjective } from '@/types/lesson';

interface LessonFormProps {
  lessonId?: string;
  initialData?: Partial<Lesson>;
  studentId?: string;
  onSave: (lessonData: Partial<Lesson>) => void;
  onCancel: () => void;
}

const LESSON_TYPES: LessonType[] = ['individual', 'group', 'workshop'];
const PROFICIENCY_LEVELS: ProficiencyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function LessonForm({ lessonId, initialData, studentId, onSave, onCancel }: LessonFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    type: 'individual',
    level: 'A1',
    topic: '',
    objectives: [],
    materials: [],
    ...initialData,
  });

  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [
        ...(prev.objectives || []),
        {
          id: crypto.randomUUID(),
          description: '',
          completed: false,
        },
      ],
    }));
  };

  const handleRemoveObjective = (id: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives?.filter(obj => obj.id !== id) || [],
    }));
  };

  const handleUpdateObjective = (id: string, description: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives?.map(obj =>
        obj.id === id ? { ...obj, description } : obj
      ) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const lessonData = {
        ...formData,
        teacherId: user.uid,
        studentId: studentId || formData.studentId,
        status: 'scheduled' as const,
      };
      
      onSave(lessonData);
    } catch (error) {
      console.error('Error saving lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for this lesson
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Lesson Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: LessonType) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Proficiency Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value: ProficiencyLevel) =>
                  setFormData(prev => ({ ...prev, level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Objectives</CardTitle>
          <CardDescription>
            Define what students should achieve in this lesson
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.objectives?.map((objective) => (
            <div key={objective.id} className="flex items-center gap-2">
              <Input
                value={objective.description}
                onChange={(e) => handleUpdateObjective(objective.id, e.target.value)}
                placeholder="Enter objective"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveObjective(objective.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddObjective}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : lessonId ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  );
}