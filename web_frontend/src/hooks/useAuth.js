import { useEffect, useState, useMemo, useCallback } from "react";
import { getSupabaseClient } from "../supabaseClient";

/**
 * PUBLIC_INTERFACE
 * useAuth: Provides Supabase auth session and helpers.
 */
export function useAuth() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session || null);
        setLoading(false);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, [supabase]);

  const signUpWithEmail = useCallback(async (email, password) => {
    const redirectTo = process.env.REACT_APP_OAUTH_REDIRECT_URL;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo || window.location.origin + "/auth",
      },
    });
    if (error) throw error;
    return data;
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = process.env.REACT_APP_OAUTH_REDIRECT_URL || window.location.origin + "/auth";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
    return data;
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return { session, user: session?.user ?? null, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut };
}
