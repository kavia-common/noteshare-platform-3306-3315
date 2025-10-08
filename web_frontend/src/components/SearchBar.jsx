import { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * SearchBar: Compact search input for querying notes
 */
export default function SearchBar({ onSubmit }) {
  const [q, setQ] = useState("");

  function submit(e) {
    e.preventDefault();
    onSubmit?.(q);
  }

  return (
    <form onSubmit={submit} className="relative">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search notes, tags, subjects..."
        className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
    </form>
  );
}
