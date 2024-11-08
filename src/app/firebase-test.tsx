'use client';

import { useAuth } from '@/app/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from 'react';

export default function FirebaseTest() {
  const { user, userData, signIn, signUp, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTestSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password, 'Test User');
      console.log('Sign up successful');
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred during sign up';
      setError(errorMessage);
      console.error('Sign up error:', error);
    }
    setLoading(false);
  };

  const handleTestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      console.log('Sign in successful');
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred during sign in';
      setError(errorMessage);
      console.error('Sign in error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Auth Test</h2>
      
      {/* Status display */}
      <div className="p-4 bg-black-100 rounded">
        <p>Status: {user ? `Logged in as ${user.email}` : 'Not logged in'}</p>
        {userData && <p>Role: {userData.role}</p>}
      </div>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Auth form */}
      <div className="space-y-4 max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-x-4">
        <Button
          onClick={handleTestSignUp}
          disabled={loading || !email || !password}
        >
          Test Sign Up
        </Button>
        <Button
          onClick={handleTestSignIn}
          disabled={loading || !email || !password}
        >
          Test Sign In
        </Button>
        {user && (
          <Button
            onClick={() => logout()}
            variant="destructive"
            disabled={loading}
          >
            Logout
          </Button>
        )}
      </div>

      {/* Debug info */}
      {user && (
        <div className="mt-4 p-4 bg-black-100 rounded">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({ user: user.toJSON(), userData }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}