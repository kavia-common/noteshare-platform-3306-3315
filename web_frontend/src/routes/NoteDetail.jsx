import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { fetchNoteById, toggleBookmark, toggleLike } from "../lib/db";

/**
 * PUBLIC_INTERFACE
 * NoteDetail: Shows PDF preview using object/embed and actions
 */
export default function NoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setBusy(true);
    fetchNoteById(id)
      .then((n) => mounted && setNote(n))
      .finally(() => mounted && setBusy(false));
    return () => { mounted = false; };
  }, [id]);

  if (busy) return <Spinner label="Loading note..." />;
  if (!note) return <div className="card p-6">Note not found.</div>;

  async function doLike() {
    setLikeLoading(true);
    try {
      const val = await toggleLike(note.id, true);
      setNote((n) => ({ ...n, likes_count: val }));
    } finally {
      setLikeLoading(false);
    }
  }

  async function doBookmark() {
    setBookmarkLoading(true);
    try {
      const val = await toggleBookmark(note.id, true);
      setNote((n) => ({ ...n, bookmarks_count: val }));
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
          <Button onClick={doLike} disabled={likeLoading} className="w-full">❤️ Like ({note.likes_count || 0})</Button>
          <Button variant="secondary" onClick={doBookmark} disabled={bookmarkLoading} className="w-full">🔖 Bookmark ({note.bookmarks_count || 0})</Button>
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
