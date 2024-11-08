'use client';

import { useState } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { UserService } from '@/lib/services/user-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LanguageLevel } from '@/types/user';

const LANGUAGE_LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];

export function ProfileForm() {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    bio: userData?.profile?.bio || '',
    interests: userData?.profile?.interests?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Actualizar perfil básico
      await UserService.updateProfile(user.uid, {
        bio: formData.bio,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
      });

      // Actualizar displayName si ha cambiado
      if (formData.displayName !== userData?.displayName) {
        await UserService.updateProfile(user.uid, {
          displayName: formData.displayName,
        });
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              displayName: e.target.value
            }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              bio: e.target.value
            }))}
            placeholder="Tell us about yourself..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">Interests (comma separated)</Label>
          <Input
            id="interests"
            value={formData.interests}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              interests: e.target.value
            }))}
            placeholder="e.g., reading, travel, music"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}