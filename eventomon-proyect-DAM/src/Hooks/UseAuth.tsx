import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  AuthError,
  User
} from 'firebase/auth';

import { ref, set } from 'firebase/database';
import { auth, db } from '../helpers/Firebase';

interface AuthResult {
  success: boolean;
  error?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await set(ref(db, `users/${credential.user.uid}`), {
        name,
        email,
        role: 'user',
        premium: false,
        attended: 0,
        upcoming: 0,
        saved: 0,
        createdAt: new Date().toISOString(),
      });

      return { success: true };

    } catch (e) {
      const error = e as AuthError;

      return {
        success: false,
        error: error.message
      };

    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      return { success: true };

    } catch (e) {
      const error = e as AuthError;

      return {
        success: false,
        error: error.message
      };

    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    register,
    login,
    loading
  };
};