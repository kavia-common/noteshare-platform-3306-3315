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
Create a .env file (see .env.example for keys):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- REACT_APP_OAUTH_REDIRECT_URL (defaults to http://localhost:3000/auth)
- REACT_APP_SITE_URL (optional, often same as app URL)

3) Start the development server
- npm start

The app will be available at http://localhost:3000.

## Supabase Notes

- Storage uploads go to the "notes" bucket. The app returns both publicUrl and a signed URL fallback.
- Auth redirect uses REACT_APP_OAUTH_REDIRECT_URL if set, otherwise defaults to http://localhost:3000/auth.
- Likes and bookmarks are toggled based on existence and counts are updated atomically.

## Available Scripts

- npm start: Runs the app in development mode
- npm test: Launches the test runner
- npm run build: Builds the app for production
- npm run eject: Ejects configuration (irreversible)

## Troubleshooting

- Ensure .env variables are set correctly.
- If you see auth redirect issues, confirm REACT_APP_OAUTH_REDIRECT_URL is whitelisted in Supabase Auth settings.
- If storage URLs are not public, a signed URL will be created automatically.
