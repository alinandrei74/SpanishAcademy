'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function StudentLessons({ studentId }: { studentId: string }) {
  const lessons = [
    {
      date: "2024-10-28",
      time: "10:00 AM",
      topic: "Past Perfect Tense",
      status: "Completed",
      grade: "A"
    },
    {
      date: "2024-10-30",
      time: "11:00 AM",
      topic: "Conditional Sentences",
      status: "Scheduled",
      grade: "-"
    },
    // Añade más lecciones de ejemplo aquí
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((lesson, i) => (
              <TableRow key={i}>
                <TableCell>{lesson.date}</TableCell>
                <TableCell>{lesson.time}</TableCell>
                <TableCell>{lesson.topic}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${lesson.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    {lesson.status}
                  </span>
                </TableCell>
                <TableCell>{lesson.grade}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}