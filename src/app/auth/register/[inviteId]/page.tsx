'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/auth-context';
import { InvitationService } from '@/lib/services/invitation-service';
import { AuthCard } from '../../components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Invitation } from '@/types/invitation';

export default function InviteRegisterPage({
  params
}: {
  params: { inviteId: string }
}) {
  const router = useRouter();
  const { signUp } = useAuth();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateInvitation = async () => {
      try {
        const result = await InvitationService.validateInvitation(params.inviteId);
        
        if (!result.valid) {
          setValidationError(result.error || 'Invalid invitation');
        } else if (result.invitation) {
          setInvitation(result.invitation);
        }
      } catch (err) {
        setValidationError('Failed to validate invitation');
      } finally {
        setLoading(false);
      }
    };

    validateInvitation();
  }, [params.inviteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    setError(null);
    setLoading(true);

    try {
      await signUp(invitation.email, password, name);
      await InvitationService.markAsUsed(params.inviteId, invitation.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <AuthCard title="Loading...">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </AuthCard>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <AuthCard title="Invalid Invitation">
          <Alert variant="destructive">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <AuthCard
        title="Complete Your Registration"
        description={`Welcome! Please complete your registration for ${invitation?.email}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={invitation?.email || ''}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Create Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Complete Registration'}
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}