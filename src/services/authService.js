import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const MOCK_STORAGE_KEY_USER = 'cep_mock_user';

export const authService = {
  /**
   * Register a new user with Supabase Auth
   * Role: 'Student' | 'Organizer'
   */
  async signUp({ email, password, fullName, role }) {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'usr-' + Date.now(),
        email,
        user_metadata: {
          full_name: fullName,
          role: role || 'Student',
        },
      };
      localStorage.setItem(MOCK_STORAGE_KEY_USER, JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role || 'Student',
        },
      },
    });

    if (error) throw error;

    // If profile table exists in backend, ensure role and name are recorded
    if (data?.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role: role || 'Student',
          updated_at: new Date().toISOString(),
        });
      } catch (profileErr) {
        // Backend trigger may already handle profiles; ignore if trigger is authoritative
        console.warn('Profile sync notice:', profileErr?.message || profileErr);
      }
    }

    return { user: data.user, session: data.session, error: null };
  },

  /**
   * Sign in existing user with email and password
   */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured) {
      // Allow seamless demo logins
      let role = 'Student';
      let fullName = 'Student User';
      if (email.toLowerCase().includes('organizer') || email.toLowerCase().includes('admin')) {
        role = 'Organizer';
        fullName = 'Campus Organizer';
      }

      const mockUser = {
        id: 'usr-demo-' + (role === 'Organizer' ? 'org' : 'std'),
        email,
        user_metadata: {
          full_name: fullName,
          role,
        },
      };
      localStorage.setItem(MOCK_STORAGE_KEY_USER, JSON.stringify(mockUser));
      return { user: mockUser, session: { access_token: 'demo-token' }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  },

  /**
   * Sign out current user
   */
  async signOut() {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(MOCK_STORAGE_KEY_USER);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Get active session
   */
  async getSession() {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(MOCK_STORAGE_KEY_USER);
      if (stored) {
        try {
          const user = JSON.parse(stored);
          return { session: { user, access_token: 'demo' }, user };
        } catch {
          return { session: null, user: null };
        }
      }
      return { session: null, user: null };
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, user: data.session?.user || null };
  },

  /**
   * Get user profile details (including role from profiles table or auth metadata)
   */
  async getUserProfile(userId) {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(MOCK_STORAGE_KEY_USER);
      if (stored) {
        try {
          const user = JSON.parse(stored);
          return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Demo User',
            role: user.user_metadata?.role || 'Student',
          };
        } catch {
          // fallback
        }
      }
      return {
        id: userId,
        email: 'student@campus.edu',
        full_name: 'Alex Johnson',
        role: 'Student',
      };
    }

    // Try fetching from profiles table
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        return data;
      }
    } catch {
      // profiles table might not have public select or fallback to auth metadata
    }

    // Fallback to user metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: user.user_metadata?.role || 'Student',
      };
    }

    return null;
  }
};
