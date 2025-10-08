# NoteShare Frontend

A clean, fast, and responsive React app for sharing PDF notes, built with React and TailwindCSS. This refactor removes Supabase and runs entirely in the browser using mock local data and localStorage for demo purposes.

## Overview and Features

NoteShare focuses on simplicity and speed.
- Modern UI built with TailwindCSS using the Ocean Professional theme
- Routing: “/” (Dashboard), “/auth”, “/upload” (protected), “/profile” (protected), “/note/:id”, 404
- Local mock authentication (email/password) stored in localStorage
- Stubbed PDF "upload" (object URL) and local notes storage in localStorage
- Dashboard search, filter by tag, sort (newest, popular, alpha), and pagination
- Note detail page with PDF preview via object/embed, like/bookmark counters (naive demo, per-user state)
- Profile page lists the user’s uploads and allows deleting own notes

Code highlights:
- Auth helpers in src/hooks/useAuth.js handle local session state (no network)
- Storage helpers in src/lib/storage.js (stub upload) and local database helpers in src/lib/db.js
- Seed notes are automatically added on first run

## Getting Started

### 1) Install dependencies
- npm install

### 2) Start the development server
- npm start

The app will be available at http://localhost:3000.

No environment variables are required. The app persists data in your browser’s localStorage under keys like ns_notes and ns_session.

## Data Model (Local)

- Notes are stored in localStorage (key: ns_notes) with fields:
  - id, user_id, title, description, subject, tags, file_url, file_path, likes_count, bookmarks_count, created_at
- Per-user likes and bookmarks are tracked via sets in localStorage:
  - ns_likes_<userId>, ns_bookmarks_<userId>
- Users are stored locally (key: ns_users) with fields:
  - id, email, password (demo only; do not use in production)

Important: This is a demo-only in-browser implementation and not secure. Do not use for production.

## Future Backend Integration

When integrating with a real backend (Supabase, Firebase, or custom API):
- Replace src/hooks/useAuth.js to call real auth endpoints
- Replace src/lib/db.js methods to call your database/API (fetchNotes, fetchNoteById, insertNote, toggleLike, toggleBookmark, fetchUserNotes, deleteNote)
- Replace src/lib/storage.js uploadPdf to upload to your storage backend (e.g., Supabase Storage, S3) and return a public or signed URL
- Remove or migrate localStorage data as needed

## Available Scripts

- npm start: Runs the app in development mode
- npm test: Launches the test runner
- npm run build: Builds the app for production
- npm run eject: Ejects configuration (irreversible)

## Notes on PDF Preview

The note detail page uses an object/embed element to preview PDFs via their URL (object URLs for uploaded files or public URLs for seed data). For production, consider secure file hosting and signed URLs if needed.

## Troubleshooting

- If you don’t see any notes initially, clear localStorage and refresh. Seed notes are created on first load.
- If uploads don’t preview, ensure you selected a PDF file and your browser allows object URL previews.
