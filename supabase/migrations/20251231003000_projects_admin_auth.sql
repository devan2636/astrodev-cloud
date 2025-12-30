-- Admin-aware auth and project ownership

-- Profiles table to store roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Recreate profile policies safely
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Profiles are readable by owner'
  ) then
    drop policy "Profiles are readable by owner" on public.profiles;
  end if;

  create policy "Profiles are readable by owner"
    on public.profiles
    for select
    using (auth.uid() = id);

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Profiles are upsertable by owner'
  ) then
    drop policy "Profiles are upsertable by owner" on public.profiles;
  end if;

  create policy "Profiles are upsertable by owner"
    on public.profiles
    for insert
    with check (auth.uid() = id);

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Profiles are updatable by owner'
  ) then
    drop policy "Profiles are updatable by owner" on public.profiles;
  end if;

  create policy "Profiles are updatable by owner"
    on public.profiles
    for update
    using (auth.uid() = id)
    with check (auth.uid() = id);
end $$;

-- Ensure projects carry owner id
alter table public.projects
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

-- RLS for project writes (select policy already exists from earlier migration)
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Projects insertable by admins'
  ) then
    drop policy "Projects insertable by admins" on public.projects;
  end if;

  create policy "Projects insertable by admins" on public.projects
    for insert
    with check (
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    );

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Projects updatable by owner admins'
  ) then
    drop policy "Projects updatable by owner admins" on public.projects;
  end if;

  create policy "Projects updatable by owner admins" on public.projects
    for update
    using (
      (owner_id = auth.uid() or owner_id is null) and
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    )
    with check (
      owner_id = auth.uid() and
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    );

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Projects deletable by owner admins'
  ) then
    drop policy "Projects deletable by owner admins" on public.projects;
  end if;

  create policy "Projects deletable by owner admins" on public.projects
    for delete
    using (
      (owner_id = auth.uid() or owner_id is null) and
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    );
end $$;
