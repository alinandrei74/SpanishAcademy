'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentCard } from "@/components/teacher/student-card";
import { CreateInvitation } from "@/components/create-invitation";
import { useAuth } from "@/app/auth/auth-context";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { UserData } from "@/types/user";

export default function StudentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [students, setStudents] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'student')
        );
        
        const querySnapshot = await getDocs(q);
        const loadedStudents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          lastLogin: doc.data().lastLogin?.toDate(),
        })) as UserData[];
        
        setStudents(loadedStudents);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [user]);

  // Filtrar estudiantes
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && student.isActive) ||
                         (filterStatus === 'inactive' && !student.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleScheduleClass = (studentId: string) => {
    router.push(`/teacher/calendar?student=${studentId}`);
  };

  const handleSendMessage = (studentId: string) => {
    // Implementar en la siguiente fase
    console.log('Send message to:', studentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button onClick={() => setShowInviteForm(true)}>
          Invite New Student
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de estudiantes */}
      {loading ? (
        <div className="text-center py-8">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No students found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.uid}
              student={student}
              onScheduleClass={handleScheduleClass}
              onSendMessage={handleSendMessage}
            />
          ))}
        </div>
      )}

      {/* Modal de invitación */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Invite New Student</h2>
            <CreateInvitation />
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setShowInviteForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}