import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { fetchNoteById, toggleBookmark, toggleLike } from "../lib/db";
import { useAuth } from "../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * NoteDetail: Shows PDF preview using object/embed and actions
 */
export default function NoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let mounted = true;
    setBusy(true);
    fetchNoteById(id)
      .then((n) => {
        if (!mounted) return;
        setNote(n);
      })
      .finally(() => mounted && setBusy(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  // Initialize liked/bookmarked state by inferring from counts (best-effort)
  useEffect(() => {
    if (!note || !user) return;
    // We don't have a dedicated existence check endpoint here; rely on UI toggle result afterwards.
    setLiked(false);
    setBookmarked(false);
  }, [note, user]);

  if (busy) return <Spinner label="Loading note..." />;
  if (!note) return <div className="card p-6">Note not found.</div>;

  async function doLike() {
    if (!user?.id) return;
    setLikeLoading(true);
    try {
      const newCount = await toggleLike(note.id, user.id);
      // Toggle optimistic state by comparing to previous count direction is unknown; flip liked
      setLiked((v) => !v);
      setNote((n) => ({ ...n, likes_count: newCount }));
    } finally {
      setLikeLoading(false);
    }
  }

  async function doBookmark() {
    if (!user?.id) return;
    setBookmarkLoading(true);
    try {
      const newCount = await toggleBookmark(note.id, user.id);
      setBookmarked((v) => !v);
      setNote((n) => ({ ...n, bookmarks_count: newCount }));
    } finally {
      setBookmarkLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
          <h1 className="text-lg font-semibold text-ocean-text">{note.title}</h1>
          <p className="text-sm text-gray-600">{note.description}</p>
        </div>
        <div className="p-0">
          <div className="w-full aspect-[3/4] bg-gray-100">
            <object data={note.file_url} type="application/pdf" className="w-full h-full">
              <embed src={note.file_url} type="application/pdf" className="w-full h-full" />
            </object>
          </div>
        </div>
      </div>
      <aside className="card p-4 h-max">
        <div className="space-y-2">
          <Button onClick={doLike} disabled={likeLoading} className="w-full">
            {liked ? "💔 Unlike" : "❤️ Like"} ({note.likes_count || 0})
          </Button>
          <Button variant="secondary" onClick={doBookmark} disabled={bookmarkLoading} className="w-full">
            {bookmarked ? "🗑️ Remove bookmark" : "🔖 Bookmark"} ({note.bookmarks_count || 0})
          </Button>
          <a
            href={note.file_url}
            download
            className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition bg-gray-900 text-white hover:opacity-95 w-full"
          >
            ⬇️ Download PDF
          </a>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-ocean-text">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {(note.tags || []).map((t) => (
              <span key={t} className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
