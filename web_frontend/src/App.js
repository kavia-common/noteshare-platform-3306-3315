import { Routes, Route, Navigate, Outlet, useLocation, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./routes/Dashboard";
import Auth from "./routes/Auth";
import Upload from "./routes/Upload";
import Profile from "./routes/Profile";
import NoteDetail from "./routes/NoteDetail";
import NotFound from "./routes/NotFound";
import { useAuth } from "./hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * App: The main application component with routing.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-ocean-background">
      <Navbar />
      <main className="pt-20 container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<Protected />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/note/:id" element={<NoteDetail />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <footer className="mt-12 py-8 text-center text-sm text-gray-500">
        <p className="mb-2">
          Built with <span className="text-ocean-secondary">Supabase</span> + React + Tailwind
        </p>
        <Link className="text-blue-600 hover:underline" to="/">Home</Link>
      </footer>
    </div>
  );
}

/** Guard for protected routes */
function Protected() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
