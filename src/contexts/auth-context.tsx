"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    url &&
    key &&
    url !== 'your-project-url.supabase.co' &&
    key !== 'your-anon-key' &&
    url.includes('supabase.co')
  );
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabaseEnabled = isSupabaseConfigured();

  useEffect(() => {
    // Only initialize Supabase if properly configured
    if (!supabaseEnabled) {
      setLoading(false);
      return undefined;
    }

    try {
      const supabase = createClientComponentClient();

      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        router.refresh();
      });

      return () => subscription.unsubscribe();
    } catch {
      setLoading(false);
      return undefined;
    }
  }, [supabaseEnabled, router]);

  const signIn = async (email: string, password: string) => {
    if (!supabaseEnabled) {
      // Demo mode - credentials checked in login page
      return { error: new Error("Supabase not configured") };
    }

    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (supabaseEnabled) {
      try {
        const supabase = createClientComponentClient();
        await supabase.auth.signOut();
      } catch {
        // Silently handle sign-out errors in demo mode
      }
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
