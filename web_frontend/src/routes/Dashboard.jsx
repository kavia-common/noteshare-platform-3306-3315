import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import NoteCard from "../components/NoteCard";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { useNotes } from "../hooks/useNotes";

/**
 * PUBLIC_INTERFACE
 * Dashboard: Browse/search notes
 */
export default function Dashboard() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [sort, setSort] = useState("new");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  const { notes, count, loading, hasNext } = useNotes({ q, tag, sort, page });

  return (
    <div>
      <section className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-ocean-text">Discover notes</h1>
          <Link to="/upload" className="text-sm text-blue-600 hover:underline">Upload your notes →</Link>
        </div>
        <p className="text-sm text-gray-600">Search and filter community-contributed PDFs.</p>
      </section>

      <section className="card p-4 mb-6">
        <FilterBar sort={sort} setSort={setSort} tag={tag} setTag={setTag} />
      </section>

      {loading ? (
        <Spinner label="Loading notes..." />
      ) : notes.length === 0 ? (
        <EmptyState title="No notes found" subtitle="Try adjusting your query or filters." />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
          <Pagination page={page} setPage={setPage} hasNext={hasNext} />
          <p className="text-xs text-gray-500 mt-2">Total: {count}</p>
        </>
      )}
    </div>
  );
}
