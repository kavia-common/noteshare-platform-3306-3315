import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchUserNotes } from "../lib/db";
import NoteCard from "../components/NoteCard";

/**
 * PUBLIC_INTERFACE
 * Profile: Basic profile info and user's uploads list
 */
export default function Profile() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchUserNotes(user.id).then((data) => mounted && setNotes(data));
    return () => { mounted = false; };
  }, [user.id]);

  return (
    <div>
      <div className="card p-6 mb-6">
        <h1 className="text-xl font-semibold text-ocean-text">Profile</h1>
        <p className="text-sm text-gray-600">Email: {user.email}</p>
        {/* Extend with editable profile fields when backend table exists */}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-ocean-text mb-3">Your uploads</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-gray-600">You haven’t uploaded any notes yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((n) => <NoteCard key={n.id} note={n} />)}
          </div>
        )}
      </div>
    </div>
  );
}
