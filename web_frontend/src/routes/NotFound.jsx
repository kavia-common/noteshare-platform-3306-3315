import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * NotFound: 404 page
 */
export default function NotFound() {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-3">🧭</div>
      <h1 className="text-2xl font-semibold text-ocean-text mb-2">Page not found</h1>
      <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="inline-flex items-center px-4 h-10 rounded-lg bg-ocean-primary text-white">Go home</Link>
    </div>
  );
}
