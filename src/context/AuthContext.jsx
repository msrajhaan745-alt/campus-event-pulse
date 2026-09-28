import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'Student' | 'Organizer' | 'Admin'
  const [loading, setLoading] = useState(true);

  // Load and sync user profile & role
  const syncUserData = useCallback(async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setRole(null);
      return;
    }

    try {
      const profile = await authService.getUserProfile(sessionUser.id);
      const userRole = profile?.role || sessionUser.user_metadata?.role || 'Student';
      const fullName = profile?.full_name || sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User';

      setUser({
        ...sessionUser,
        fullName,
        role: userRole,
      });
      setRole(userRole);
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback to metadata
      const fallbackRole = sessionUser.user_metadata?.role || 'Student';
      setUser({
        ...sessionUser,
        fullName: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
        role: fallbackRole,
      });
      setRole(fallbackRole);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { user: currentAuthUser } = await authService.getSession();
        if (mounted) {
          if (currentAuthUser) {
            await syncUserData(currentAuthUser);
          } else {
            setUser(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Supabase Auth listener
    let authListener = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          await syncUserData(session.user);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });
      authListener = data.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, [syncUserData]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user: loggedInUser } = await authService.signIn({ email, password });
      await syncUserData(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, fullName, role: selectedRole }) => {
    setLoading(true);
    try {
      const { user: registeredUser } = await authService.signUp({
        email,
        password,
        fullName,
        role: selectedRole,
      });
      await syncUserData(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: Boolean(user),
        isStudent: role === 'Student',
        isOrganizer: role === 'Organizer',
        isAdmin: role === 'Admin',
        login,
        register,
        logout,
        syncUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
