import { useEffect, useState, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * useAuth: Provides local mock auth using localStorage (no external services).
 * - session: { user: { id, email } } | null
 * - user: { id, email } | null
 * - signInWithEmail(email, password)
 * - signUpWithEmail(email, password)
 * - signOut()
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage once
  useEffect(() => {
    const raw = localStorage.getItem("ns_session");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.user?.id && parsed?.user?.email) {
          setSession(parsed);
        }
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  // Create a simple users store in localStorage
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem("ns_users") || "[]");
    } catch {
      return [];
    }
  }
  function setUsers(users) {
    localStorage.setItem("ns_users", JSON.stringify(users));
  }

  const signInWithEmail = useCallback(async (email, password) => {
    const users = getUsers();
    const exists = users.find((u) => u.email === email && u.password === password);
    if (!exists) {
      const err = new Error("Invalid email or password");
      err.code = "auth/invalid-credentials";
      throw err;
    }
    const nextSession = { user: { id: exists.id, email: exists.email } };
    localStorage.setItem("ns_session", JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }, []);

  const signUpWithEmail = useCallback(async (email, password) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      const err = new Error("Email already registered");
      err.code = "auth/email-in-use";
      throw err;
    }
    const newUser = { id: `user_${Date.now().toString(36)}`, email, password };
    users.push(newUser);
    setUsers(users);
    const nextSession = { user: { id: newUser.id, email: newUser.email } };
    localStorage.setItem("ns_session", JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession;
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem("ns_session");
    setSession(null);
  }, []);

  return { session, user: session?.user ?? null, loading, signInWithEmail, signUpWithEmail, signOut };
}
