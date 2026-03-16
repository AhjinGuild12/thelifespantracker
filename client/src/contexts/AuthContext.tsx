import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthActionError {
  message: string;
}

type AuthActionResult = Promise<{ error: AuthActionError | null }>;

const missingSupabaseConfigError = {
  message:
    "Authentication is temporarily unavailable on this deployment. Cloudflare is missing the public Supabase VITE_* variables at build time.",
};

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => AuthActionResult;
  signInWithApple: () => AuthActionResult;
  signInWithEmail: (
    email: string,
    password: string
  ) => AuthActionResult;
  signUp: (
    email: string,
    password: string
  ) => AuthActionResult;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { error: missingSupabaseConfigError };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    return { error };
  }, []);

  const signInWithApple = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { error: missingSupabaseConfigError };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
    });
    return { error };
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured) {
        return { error: missingSupabaseConfigError };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    []
  );

  const signUp = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: missingSupabaseConfigError };
    }

    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUp,
        signOut,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
