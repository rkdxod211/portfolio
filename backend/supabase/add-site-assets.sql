-- Site images/files the admin can replace (profile photo, background, resume).
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run more than once.

-- Public bucket: files are readable by anyone via their URL; only the backend
-- (service role key) can upload or delete.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

-- Which uploaded file is currently used for each slot. A missing row means
-- the site falls back to the bundled default in frontend/public.
create table if not exists site_assets (
    key text primary key check (key in ('profile', 'background', 'resume')),
    path text not null, -- object path inside the site-assets bucket
    url text not null,  -- public URL served to visitors
    updated_at timestamptz not null default now()
);
alter table site_assets enable row level security;
