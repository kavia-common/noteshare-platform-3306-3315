# NoteShare Frontend

A clean, fast, and responsive React app for sharing PDF notes, built with React, TailwindCSS, and Supabase (Auth, Database, Storage).

## Overview and Features

- Ocean Professional theme with responsive UI
- Routing: “/” (Dashboard), “/auth”, “/upload” (protected), “/profile” (protected), “/note/:id”, 404
- Supabase Auth: email/password and Google OAuth
- Supabase Database: notes, likes, bookmarks, profiles tables
- Supabase Storage: uploads PDFs to the "notes" bucket with public or signed URLs
- Dashboard search, tag filter, sort (newest, popular, alpha), and pagination
- Note detail page with PDF preview, like and bookmark toggles (idempotent)
- Profile lists user uploads with delete controls

## Getting Started

1) Install dependencies
- npm install

2) Environment variables
Create a .env file (see .env.example for keys). These must be prefixed with REACT_APP_:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- REACT_APP_OAUTH_REDIRECT_URL (defaults to http://localhost:3000/auth if unset)
- REACT_APP_SITE_URL (optional, often same as app URL)

3) Start the development server
- npm start

The app will be available at http://localhost:3000.

## Supabase and Data Model

- Storage uploads go to the "notes" bucket. The upload helper returns both:
  - path/file_path (storage object path)
  - publicUrl/file_url (a public URL if bucket is public, otherwise a signed URL fallback)
- Auth redirect uses REACT_APP_OAUTH_REDIRECT_URL if set; otherwise the app falls back to `${window.location.origin}/auth` (http://localhost:3000/auth in dev).
- Likes and bookmarks use idempotent toggles:
  - If the like/bookmark exists for the user, it is deleted; otherwise it is created.
  - The functions return the updated aggregate count and update the note row.
- Deleting a note removes the DB row for the owner. Storage deletion is not automatic in this template; see "Deleting storage objects" below.

## Available Scripts

- npm start: Runs the app in development mode
- npm test: Launches the test runner
- npm run build: Builds the app for production
- npm run eject: Ejects configuration (irreversible)

## Flows and API shapes

- Auth (email/password + Google OAuth): Implemented via Supabase client in src/hooks/useAuth.js. Uses process.env variables only.
- Upload:
  - src/lib/storage.js uploadPdf(file, prefix) returns: { path, file_path, publicUrl, file_url }
  - src/lib/db.js insertNote expects: { title, description, subject?, tags[], file_path, file_url, user_id }
- Dashboard:
  - src/lib/db.js fetchNotes({ q, tag, sort, limit, offset }) returns { items, total }
  - Supports sorts: new (created_at desc), popular (likes_count desc), alpha (title asc)
- NoteDetail:
  - fetchNoteById(id) returns a single note
  - toggleLike(noteId, userId) and toggleBookmark(noteId, userId) return updated counts (number)
- Profile:
  - fetchUserNotes(userId) returns current user's notes, newest first
  - deleteNote(noteId, userId) removes the DB row if owner

## Deployment notes

- Ensure your Supabase project's Auth redirect URLs include your deployment URL and the /auth path (e.g., https://yourapp.com/auth).
- Set environment variables in your hosting provider with the same names as in .env.example (REACT_APP_*).
- If the "notes" bucket is private, the app will create signed URLs for viewing and download; if public, it will use the public URL.

## Troubleshooting

- Missing Supabase env vars:
  - You will see a console warning if REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY are not set.
- OAuth redirect issues:
  - Confirm REACT_APP_OAUTH_REDIRECT_URL is set and whitelisted in Supabase Authentication -> URL Configuration.
- Storage access:
  - If PDFs do not render, confirm the "notes" bucket exists and that either
    - it is public, or
    - signed URLs are enabled (default behavior in this app if not public).
- Pagination and search:
  - The dashboard uses range queries and exact count; ensure PostgREST row count is enabled (default).
- Deleting storage objects:
  - For simplicity, deleting a note currently removes the DB row only. If you want to also remove the storage object, you can call supabase.storage.from('notes').remove([file_path]) after delete.

## Security and RLS

- The supplied docs/supabase.sql enables RLS and creates policies for profiles, notes, likes, and bookmarks.
- For production-grade atomic counters, consider database triggers/edge functions instead of client-updated counts.

