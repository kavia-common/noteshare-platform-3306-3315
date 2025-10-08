import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * Auth: Sign in/up with email/password, Google OAuth
 */
export default function Auth() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, session } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (session) {
    const dest = location.state?.from?.pathname || "/";
    navigate(dest, { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message || "Authentication error");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Failed to start Google sign-in");
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-ocean-text mb-1">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-gray-600 mb-6">
          {mode === "signin" ? "Sign in to continue" : "Sign up to start sharing and bookmarking notes"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}</Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Button onClick={handleGoogle} variant="ghost" className="w-full">Continue with Google</Button>

        <p className="text-sm text-gray-600 mt-4">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button className="text-blue-600 hover:underline" onClick={() => setMode("signup")}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="text-blue-600 hover:underline" onClick={() => setMode("signin")}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
