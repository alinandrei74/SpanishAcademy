'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserData } from '@/types/user';
import { UserService } from '@/lib/services/user-service';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Obtener el token y guardarlo en una cookie
        const token = await user.getIdToken();
        document.cookie = `firebase-auth-token=${token}; path=/`;
        
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            ...data,
            createdAt: data.createdAt?.toDate(),
            lastLogin: data.lastLogin?.toDate(),
          } as UserData);
        }
      } else {
        setUserData(null);
        // Eliminar la cookie cuando el usuario cierra sesión
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Update last login
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore with expanded data
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName,
        photoURL: null,
        role: 'student',
        profile: UserService.getDefaultProfile(),
        preferences: UserService.getDefaultPreferences(),
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        metadata: {
          completedLessons: 0,
          totalLessons: 0,
          averageRating: 0,
          certificationsCount: 0,
        }
      });

      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // La cookie se eliminará en el useEffect cuando el estado de auth cambie
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await updateProfile(user, { displayName, photoURL: photoURL || null });
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL: photoURL || null,
      }, { merge: true });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}