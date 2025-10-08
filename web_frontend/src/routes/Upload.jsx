import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import TagInput from "../components/TagInput";
import { uploadPdf } from "../lib/storage";
import { insertNote } from "../lib/db";
import { useAuth } from "../hooks/useAuth";

/**
 * PUBLIC_INTERFACE
 * Upload: Upload PDF (stub) and insert metadata locally.
 */
export default function Upload() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !title) {
      setMsg("Please provide a PDF file and a title.");
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMsg("Only PDF files are allowed.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const { path, publicUrl } = await uploadPdf(file, `user-${user.id}`);
      await insertNote({
        title,
        description,
        tags,
        file_path: path,
        file_url: publicUrl,
        user_id: user.id,
        likes_count: 0,
        bookmarks_count: 0,
      });
      setMsg("Upload successful! You can view it on the dashboard.");
      setTitle("");
      setDescription("");
      setTags([]);
      setFile(null);
    } catch (err) {
      setMsg(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-ocean-text mb-1">Upload notes (PDF)</h1>
        <p className="text-sm text-gray-600 mb-4">Share study guides, problem sets, and more with the community.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          <TagInput label="Tags" value={tags} onChange={setTags} />
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">PDF file</span>
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {msg && <p className="text-sm text-gray-700">{msg}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Uploading..." : "Upload"}</Button>
        </form>
      </div>
    </div>
  );
}
