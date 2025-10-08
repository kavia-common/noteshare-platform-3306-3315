# NoteShare Frontend

A clean, fast, and responsive React app for sharing PDF notes, built with TailwindCSS and Supabase.

## Quick Start

1) Install dependencies
- npm install

2) Set environment variables
- Copy .env.example to .env and fill in:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
  - REACT_APP_OAUTH_REDIRECT_URL

3) Start the app
- npm start

## Features implemented
- Tailwind styling with Ocean Professional theme
- Routing: / (Dashboard), /auth, /upload (protected), /profile (protected), /note/:id, 404
- Supabase auth (email/password + Google OAuth)
- Upload PDF to Storage bucket 'notes', insert metadata to 'notes' table
- Dashboard search/filter/sort/pagination
- Note detail preview via <object>/<embed>, like/bookmark (naive counters)
- Profile with user's uploads

Note: Backend database schema and Storage bucket are expected to exist in Supabase. See DocumentationAgent step to expand setup details and policies.
