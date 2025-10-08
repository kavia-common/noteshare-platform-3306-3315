import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * useAuth: Provides Supabase auth for email/password and Google OAuth.
 * - session, user, loading, error
 * - signInWithEmail(email, password)
 * - signUpWithEmail(email, password)
 * - signInWithGoogle()
 * - signOut()
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) console.error(error);
      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      // Upsert profile on sign-in
      if (sess?.user) {
        const profile = {
          id: sess.user.id,
          email: sess.user.email,
          display_name: sess.user.user_metadata?.name || sess.user.email?.split("@")[0] || "User",
          avatar_url: sess.user.user_metadata?.avatar_url || null,
        };
        await supabase.from("profiles").upsert(profile, { onConflict: "id" });
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signUpWithEmail = useCallback(async (email, password) => {
    setError(null);
    const redirectTo = process.env.REACT_APP_OAUTH_REDIRECT_URL || `${window.location.origin}/auth`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const redirectTo = process.env.REACT_APP_OAUTH_REDIRECT_URL || `${window.location.origin}/auth`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  return { session, user, loading, error, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut };
}
