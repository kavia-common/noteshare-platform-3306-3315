import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchUserNotes, deleteNote } from "../lib/db";
import NoteCard from "../components/NoteCard";
import Button from "../components/Button";

/**
 * PUBLIC_INTERFACE
 * Profile: Basic profile info and user's uploads list (local).
 */
export default function Profile() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  async function load() {
    const data = await fetchUserNotes(user.id);
    setNotes(data);
  }

  useEffect(() => {
    load().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  async function onDelete(id) {
    await deleteNote(id, user.id);
    await load();
  }

  return (
    <div>
      <div className="card p-6 mb-6">
        <h1 className="text-xl font-semibold text-ocean-text">Profile</h1>
        <p className="text-sm text-gray-600">Email: {user.email}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-ocean-text mb-3">Your uploads</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-600">You haven’t uploaded any notes yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((n) => (
              <div key={n.id} className="relative">
                <NoteCard note={n} />
                <div className="absolute top-2 right-2">
                  <Button variant="danger" onClick={() => onDelete(n.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
