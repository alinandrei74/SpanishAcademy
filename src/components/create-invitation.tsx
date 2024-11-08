'use client';

import { useState } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { InvitationService } from '@/lib/services/invitation-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CreateInvitation() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setInviteLink(null);
    setLoading(true);

    try {
      const inviteId = await InvitationService.createInvitation(
        { email, role },
        user.uid
      );
      
      const link = `${window.location.origin}/auth/register/${inviteId}`;
      setInviteLink(link);
    } catch (err: any) {
      setError(err.message || 'Failed to create invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invitation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {inviteLink && (
            <Alert>
              <AlertDescription>
                <p>Invitation created successfully!</p>
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="w-full mt-2 p-2 bg-secondary rounded"
                  onClick={e => (e.target as HTMLInputElement).select()}
                />
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: 'student' | 'teacher') => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}