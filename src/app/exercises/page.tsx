'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/auth/auth-context";

export default function ExercisesPage() {
  const { userData } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Exercises</h1>
          <p className="text-muted-foreground">Practice and improve your skills</p>
        </div>
        {userData?.role === 'teacher' && (
          <Button onClick={() => console.log('Create exercise')}>
            Create Exercise
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterType}
          onValueChange={setFilterType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
            <SelectItem value="fill-in-blanks">Fill in the Blanks</SelectItem>
            <SelectItem value="matching">Matching</SelectItem>
            <SelectItem value="ordering">Ordering</SelectItem>
            <SelectItem value="translation">Translation</SelectItem>
            <SelectItem value="free-writing">Free Writing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exercise List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Cards */}
        {[1, 2, 3].map((n) => (
          <Card key={n}>
            <CardHeader>
              <CardTitle>Sample Exercise {n}</CardTitle>
              <CardDescription>Multiple Choice</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Practice your vocabulary with this multiple choice exercise.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">10</span> points
                </div>
                <Button variant="secondary" size="sm">
                  Start Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}