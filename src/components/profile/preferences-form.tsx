'use client';

import { useState } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { UserService } from '@/lib/services/user-service';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PreferencesForm() {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    notifications: {
      email: userData?.preferences?.notifications?.email ?? true,
      push: userData?.preferences?.notifications?.push ?? true,
      sms: userData?.preferences?.notifications?.sms ?? false,
    },
    theme: userData?.preferences?.theme || 'system',
    language: userData?.preferences?.language || 'en',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await UserService.updatePreferences(user.uid, preferences);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
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
          <AlertDescription>Preferences updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="font-medium">Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => setPreferences(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    email: checked
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <Switch
                id="pushNotifications"
                checked={preferences.notifications.push}
                onCheckedChange={(checked) => setPreferences(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    push: checked
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <Switch
                id="smsNotifications"
                checked={preferences.notifications.sms}
                onCheckedChange={(checked) => setPreferences(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    sms: checked
                  }
                }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={preferences.theme}
            onValueChange={(value) => setPreferences(prev => ({
              ...prev,
              theme: value as 'light' | 'dark' | 'system'
            }))}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={preferences.language}
            onValueChange={(value) => setPreferences(prev => ({
              ...prev,
              language: value
            }))}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </form>
  );
}