'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentNotesProps {
  studentId: string;
}

export function StudentNotes({ studentId }: StudentNotesProps) {
  const [newNote, setNewNote] = useState('');
  
  const notes = [
    {
      date: "2024-10-28",
      content: "Student shows great progress in speaking fluency.",
      author: "Teacher Name"
    },
    {
      date: "2024-10-25",
      content: "Needs more practice with irregular verbs.",
      author: "Teacher Name"
    },
  ];

  const handleAddNote = () => {
    console.log('Adding note:', newNote);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Add New Note */}
      <div className="space-y-4">
        <Textarea
          placeholder="Add a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleAddNote} disabled={!newNote.trim()}>
          Add Note
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note, i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                {note.date} - {note.author}
              </p>
              <p>{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}