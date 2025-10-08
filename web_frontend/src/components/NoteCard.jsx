import dayjs from "dayjs";
import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * NoteCard: Displays a note summary
 */
export default function NoteCard({ note }) {
  return (
    <Link to={`/note/${note.id}`} className="card p-4 hover:shadow-lg transition block">
      <div className="flex items-start gap-3">
        <div className="h-12 w-10 rounded-md bg-blue-50 text-blue-700 grid place-items-center text-sm font-semibold">PDF</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ocean-text truncate">{note.title}</h3>
          <p className="text-sm text-gray-500 truncate">{note.description || "No description"}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>{dayjs(note.created_at).format("MMM D, YYYY")}</span>
            <span>•</span>
            <span>{(note.tags || []).slice(0, 3).join(", ")}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 text-right">
          <div>❤️ {note.likes_count || 0}</div>
          <div>🔖 {note.bookmarks_count || 0}</div>
        </div>
      </div>
    </Link>
  );
}
