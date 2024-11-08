'use client';

import { useState } from 'react';
import { useAuth } from '@/app/auth/auth-context';
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
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, FileText, Video, Headphones, PenTool, X, ExternalLink } from "lucide-react";
import type { LessonMaterial } from '@/types/lesson';
import { LessonService } from '@/lib/services/lesson-service';

interface LessonMaterialsProps {
  lessonId: string;
  materials: LessonMaterial[];
  onUpdate: (materials: LessonMaterial[]) => void;
}

export function LessonMaterials({ lessonId, materials, onUpdate }: LessonMaterialsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Partial<LessonMaterial>>({
    type: 'document',
    title: '',
    description: '',
    url: '',
    content: '',
  });

  const materialTypeIcons = {
    document: <FileText className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    audio: <Headphones className="h-4 w-4" />,
    exercise: <PenTool className="h-4 w-4" />,
  };

  const handleAddMaterial = async () => {
    try {
      if (!newMaterial.title || !newMaterial.type) return;

      const materialId = await LessonService.addMaterial(lessonId, newMaterial as Omit<LessonMaterial, 'id'>);
      const updatedMaterial = { ...newMaterial, id: materialId } as LessonMaterial;
      onUpdate([...materials, updatedMaterial]);
      setShowAddDialog(false);
      setNewMaterial({
        type: 'document',
        title: '',
        description: '',
        url: '',
        content: '',
      });
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleRemoveMaterial = async (materialId: string) => {
    try {
      // Actualiza la lista de materiales localmente
      const updatedMaterials = materials.filter(m => m.id !== materialId);
      onUpdate(updatedMaterials);
      
      // Actualiza en Firestore
      await LessonService.updateLesson(lessonId, {
        materials: updatedMaterials
      });
    } catch (error) {
      console.error('Error removing material:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lesson Materials</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Material</DialogTitle>
              <DialogDescription>
                Add learning materials for this lesson
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Material Type</Label>
                <Select
                  value={newMaterial.type}
                  onValueChange={(value: LessonMaterial['type']) => 
                    setNewMaterial(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter material title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter material description"
                />
              </div>

              <div className="space-y-2">
                <Label>URL (optional)</Label>
                <Input
                  value={newMaterial.url}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Enter resource URL"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={newMaterial.content}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter material content"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMaterial}>
                  Add Material
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map((material) => (
          <Card key={material.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center space-x-2">
                {materialTypeIcons[material.type]}
                <div>
                  <CardTitle className="text-base">{material.title}</CardTitle>
                  <CardDescription>{material.type}</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveMaterial(material.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {material.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {material.description}
                </p>
              )}
              {material.content && (
                <p className="text-sm mt-2">{material.content}</p>
              )}
            </CardContent>
            {material.url && (
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Resource
                  </a>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}