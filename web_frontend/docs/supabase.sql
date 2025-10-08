-- NoteShare Supabase schema, indexes, trigger, and RLS policies
-- Run in Supabase SQL Editor

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Tables

-- profiles: mirrors auth.users(id)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- notes: metadata for uploaded PDFs
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  subject text,
  tags text[] default '{}',
  file_path text not null,
  file_url text not null,
  likes_count integer default 0,
  bookmarks_count integer default 0,
  created_at timestamptz default now()
);

-- likes: per-user unique like
create table if not exists public.likes (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  note_id uuid not null references public.notes(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, note_id)
);

-- bookmarks: per-user unique bookmark
create table if not exists public.bookmarks (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  note_id uuid not null references public.notes(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, note_id)
);

-- Indexes
create index if not exists idx_notes_created_at_desc on public.notes (created_at desc);
create index if not exists idx_notes_title on public.notes (title);
create index if not exists idx_notes_tags_gin on public.notes using gin (tags);
create index if not exists idx_likes_note_id on public.likes (note_id);
create index if not exists idx_bookmarks_note_id on public.bookmarks (note_id);

-- Trigger to upsert profiles on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = excluded.display_name,
        avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- RLS enablement
alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;

-- Policies

-- profiles:
-- Allow everyone to read limited public fields; allow users to read their full row and update their own row.
do $$
begin
  -- Clean up existing policies with these names if they exist
  if exists (select 1 from pg_policies where polname = 'profiles_public_select') then
    drop policy "profiles_public_select" on public.profiles;
  end if;
  if exists (select 1 from pg_policies where polname = 'profiles_self_select') then
    drop policy "profiles_self_select" on public.profiles;
  end if;
  if exists (select 1 from pg_policies where polname = 'profiles_self_update') then
    drop policy "profiles_self_update" on public.profiles;
  end if;
end$$;

create policy "profiles_public_select"
  on public.profiles
  for select
  using (true);

create policy "profiles_self_select"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id);

-- notes:
do $$
begin
  if exists (select 1 from pg_policies where polname = 'notes_select_all_authenticated') then
    drop policy "notes_select_all_authenticated" on public.notes;
  end if;
  if exists (select 1 from pg_policies where polname = 'notes_owner_insert') then
    drop policy "notes_owner_insert" on public.notes;
  end if;
  if exists (select 1 from pg_policies where polname = 'notes_owner_update') then
    drop policy "notes_owner_update" on public.notes;
  end if;
  if exists (select 1 from pg_policies where polname = 'notes_owner_delete') then
    drop policy "notes_owner_delete" on public.notes;
  end if;
end$$;

create policy "notes_select_all_authenticated"
  on public.notes
  for select
  to authenticated
  using (true);

create policy "notes_owner_insert"
  on public.notes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "notes_owner_update"
  on public.notes
  for update
  to authenticated
  using (auth.uid() = user_id);

create policy "notes_owner_delete"
  on public.notes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- likes:
do $$
begin
  if exists (select 1 from pg_policies where polname = 'likes_select_authenticated') then
    drop policy "likes_select_authenticated" on public.likes;
  end if;
  if exists (select 1 from pg_policies where polname = 'likes_owner_insert') then
    drop policy "likes_owner_insert" on public.likes;
  end if;
  if exists (select 1 from pg_policies where polname = 'likes_owner_delete') then
    drop policy "likes_owner_delete" on public.likes;
  end if;
end$$;

create policy "likes_select_authenticated"
  on public.likes
  for select
  to authenticated
  using (true);

create policy "likes_owner_insert"
  on public.likes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "likes_owner_delete"
  on public.likes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- bookmarks:
do $$
begin
  if exists (select 1 from pg_policies where polname = 'bookmarks_select_authenticated') then
    drop policy "bookmarks_select_authenticated" on public.bookmarks;
  end if;
  if exists (select 1 from pg_policies where polname = 'bookmarks_owner_insert') then
    drop policy "bookmarks_owner_insert" on public.bookmarks;
  end if;
  if exists (select 1 from pg_policies where polname = 'bookmarks_owner_delete') then
    drop policy "bookmarks_owner_delete" on public.bookmarks;
  end if;
end$$;

create policy "bookmarks_select_authenticated"
  on public.bookmarks
  for select
  to authenticated
  using (true);

create policy "bookmarks_owner_insert"
  on public.bookmarks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "bookmarks_owner_delete"
  on public.bookmarks
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Notes:
-- - likes_count and bookmarks_count are maintained by the frontend after count queries.
-- - For production, consider triggers or edge functions to update counts atomically.

