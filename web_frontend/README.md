# NoteShare Frontend

A clean, fast, and responsive React app for sharing PDF notes, built with React, TailwindCSS, and Supabase. Users can authenticate with email/password or Google OAuth, upload PDFs to Supabase Storage, browse and search notes with filters and pagination, preview files in-browser, and download them.

## Overview and Features

NoteShare focuses on simplicity and speed.
- Modern UI built with TailwindCSS using the Ocean Professional theme
- Routing: “/” (Dashboard), “/auth”, “/upload” (protected), “/profile” (protected), “/note/:id”, 404
- Supabase authentication (email/password + Google OAuth)
- Upload PDFs to the “notes” storage bucket, store metadata to the “notes” table
- Dashboard search, filter by tag, sort (newest, popular, alpha), and pagination
- Note detail page with PDF preview via object/embed, like/bookmark counters (naive demo)
- Profile page lists the user’s uploads

Code highlights:
- Supabase client created in src/supabaseClient.js using REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
- Auth helpers in src/hooks/useAuth.js handle session state and OAuth/email flows
- Storage helpers in src/lib/storage.js and database helpers in src/lib/db.js

## Getting Started

Follow these steps to get the app running locally.

### 1) Install dependencies
- npm install

### 2) Configure environment variables
Copy .env.example to .env and fill the values from your Supabase project:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- REACT_APP_OAUTH_REDIRECT_URL (default: http://localhost:3000/auth)

For local development, you can set:
- REACT_APP_OAUTH_REDIRECT_URL=http://localhost:3000/auth

### 3) Start the development server
- npm start

The app will be available at http://localhost:3000.

## Environment Variables

These variables are read by the React app at build/runtime.
- REACT_APP_SUPABASE_URL: Your Supabase project URL (Project Settings → API)
- REACT_APP_SUPABASE_ANON_KEY: The anonymous public API key (Project Settings → API)
- REACT_APP_OAUTH_REDIRECT_URL: The URL where Supabase redirects after OAuth or email link flows. In development, use http://localhost:3000/auth

Important: When changing env variables, stop and restart the dev server for changes to apply.

## Supabase Setup

This section covers creating the project, configuring storage buckets, creating tables, adding Row Level Security (RLS) policies, and enabling OAuth.

### 1) Create a Supabase project
- Sign in at https://supabase.com, create a new project
- From Project Settings → API, copy the Project URL and anon public key
- Paste them into your .env as REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY

### 2) Create Storage buckets
Create the following buckets in Storage:
- notes: Stores uploaded PDFs
- profile_avatars (optional): For user avatars

You can choose to make notes public or use signed URLs. This starter assumes public access for simplicity so previews and downloads work without signed URL generation.

If using public:
- In Storage → notes → Settings, enable public access
- Alternatively, leave private and update the app to use signed URLs instead of publicUrl

### 3) Database schema

Run the SQL below in the SQL Editor to create tables. This schema reflects the fields used in the codebase.

```
-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- profiles table, tied to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now()
);

-- notes table
create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  subject text,
  tags text[],
  file_path text not null,
  file_url text not null,
  file_size integer,
  pages integer,
  preview_url text,
  likes_count integer default 0,
  bookmarks_count integer default 0,
  created_at timestamp with time zone default now()
);

-- likes table (optional, for per-user likes; counters in UI are naive)
create table if not exists public.likes (
  id uuid primary key default uuid_generate_v4(),
  note_id uuid not null references public.notes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (note_id, user_id)
);

-- bookmarks table (optional, for per-user bookmarks; counters in UI are naive)
create table if not exists public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  note_id uuid not null references public.notes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (note_id, user_id)
);
```

### 4) Enable RLS and add policies

Turn on Row Level Security (RLS) for relevant tables and add basic policies.

```
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;

-- profiles policies
create policy "Profiles are viewable by everyone"
on public.profiles for select
using (true);

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

-- notes policies
create policy "Notes are viewable by everyone"
on public.notes for select
using (true);

create policy "Authenticated users can insert their own notes"
on public.notes for insert
with check (auth.uid() = user_id);

create policy "Users can update their own notes"
on public.notes for update
using (auth.uid() = user_id);

create policy "Users can delete their own notes"
on public.notes for delete
using (auth.uid() = user_id);

-- likes policies (optional if you adopt per-user likes)
create policy "Likes are viewable by note readers"
on public.likes for select
using (true);

create policy "Users can like with their own user_id"
on public.likes for insert
with check (auth.uid() = user_id);

create policy "Users can remove their own likes"
on public.likes for delete
using (auth.uid() = user_id);

-- bookmarks policies (optional if you adopt per-user bookmarks)
create policy "Bookmarks are viewable by note readers"
on public.bookmarks for select
using (true);

create policy "Users can bookmark with their own user_id"
on public.bookmarks for insert
with check (auth.uid() = user_id);

create policy "Users can remove their own bookmarks"
on public.bookmarks for delete
using (auth.uid() = user_id);
```

Note: The current frontend updates likes_count and bookmarks_count directly on the notes table in a naive way for demo purposes. For production, prefer per-user like/bookmark tables with database triggers or edge functions to maintain counters safely.

### 5) Create a profile row on signup

You can keep a trigger to auto-create profiles when a user signs up:

```
-- Create function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, split_part(new.email, '@', 1), split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

### 6) OAuth configuration (Google)

Configure Google OAuth in Supabase:
- In Authentication → Providers → Google, enable the provider
- Provide Client ID and Client Secret from your Google Cloud Console
- Set Redirect URLs to include your app redirect URL, e.g.:
  - http://localhost:3000/auth (development)
  - https://yourdomain.com/auth (production)

Ensure REACT_APP_OAUTH_REDIRECT_URL matches the allowed redirect URL.

## Available Scripts

- npm start: Runs the app in development mode
- npm test: Launches the test runner
- npm run build: Builds the app for production
- npm run eject: Ejects configuration (irreversible)

## Optional: PDF Preview Notes

The app uses a basic object/embed element to preview PDFs at /note/:id. This works well for public files. If you switch to private buckets, you can:
- Generate signed URLs via supabase.storage.from('notes').createSignedUrl(path, expiresIn)
- Use the signed URL temporarily for previews and downloads
- Consider a serverless or edge function proxy if you need stricter controls and referer checks

## Deployment Notes

- Ensure environment variables are configured in your hosting platform (e.g., Vercel, Netlify, Render)
- Update REACT_APP_OAUTH_REDIRECT_URL to your production URL, e.g., https://yourdomain.com/auth
- If using public storage, confirm the “notes” bucket is public. If using signed URLs, update storage logic accordingly
- Make sure your site URL and redirect URLs are set correctly in Supabase Project Settings → Authentication → URL Configuration and in the OAuth provider settings

## Troubleshooting

- If you see “Supabase env vars are missing” in the browser console, ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set and the dev server has been restarted
- RLS errors usually mean policies are missing or the user doesn’t meet the “auth.uid()” checks. Review the policies above
- For OAuth, if you encounter redirect_mismatch errors, double-check the exact redirect URL in both Supabase and your Google Cloud OAuth credentials
