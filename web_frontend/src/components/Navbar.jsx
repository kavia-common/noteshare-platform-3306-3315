import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SearchBar from "./SearchBar";
import Button from "./Button";

/**
 * PUBLIC_INTERFACE
 * Navbar: Top navigation bar with branding, search, and auth controls.
 */
export default function Navbar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showSearch = !location.pathname.startsWith("/auth");

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container">
        <div className="flex items-center gap-4 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white grid place-items-center shadow-soft">N</div>
            <div>
              <p className="font-semibold text-ocean-text leading-5">NoteShare</p>
              <p className="text-xs text-gray-500 -mt-0.5">Share. Browse. Learn.</p>
            </div>
          </Link>
          {showSearch && (
            <div className="flex-1 hidden md:block">
              <SearchBar onSubmit={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/upload")}
              className="hidden sm:inline-flex"
            >
              Upload
            </Button>
            {session ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/profile")}>
                  Profile
                </Button>
                <Button variant="danger" onClick={signOut}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign in</Button>
            )}
          </div>
        </div>
        {showSearch && (
          <div className="md:hidden pb-3">
            <SearchBar onSubmit={(q) => navigate(`/?q=${encodeURIComponent(q)}`)} />
          </div>
        )}
      </div>
      <div className={`h-1 bg-gradient-to-r ${"from-blue-500/10 to-gray-50"}`} aria-hidden />
    </nav>
  );
}
