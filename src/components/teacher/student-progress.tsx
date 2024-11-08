'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function StudentProgress({ studentId }: { studentId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Student's progress across different areas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Grammar</span>
            <span>75%</span>
          </div>
          <Progress value={75} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Vocabulary</span>
            <span>60%</span>
          </div>
          <Progress value={60} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Speaking</span>
            <span>80%</span>
          </div>
          <Progress value={80} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Listening</span>
            <span>70%</span>
          </div>
          <Progress value={70} />
        </div>
      </CardContent>
    </Card>
  );
}