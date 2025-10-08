import { createClient } from "@supabase/supabase-js";

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client instance configured via env vars.
 */
let supabase;

/**
 * PUBLIC_INTERFACE
 */
export function getSupabaseClient() {
  /** Create client only once */
  if (!supabase) {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const anon = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!url || !anon) {
      // Warn early to help setup
      // eslint-disable-next-line no-console
      console.warn(
        "Supabase env vars are missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
      );
    }

    supabase = createClient(url || "", anon || "", {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabase;
}
