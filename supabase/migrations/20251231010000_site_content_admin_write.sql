-- Add admin write policy for site_content table
-- This allows admins to insert and update site content

do $$
begin
  -- Drop existing policies if they exist to avoid conflicts
  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_content'
      and policyname = 'Admin can insert site content'
  ) then
    drop policy "Admin can insert site content" on public.site_content;
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_content'
      and policyname = 'Admin can update site content'
  ) then
    drop policy "Admin can update site content" on public.site_content;
  end if;

  -- Create insert policy for admins
  create policy "Admin can insert site content"
    on public.site_content
    for insert
    with check (
      exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
          and profiles.role = 'admin'
      )
    );

  -- Create update policy for admins
  create policy "Admin can update site content"
    on public.site_content
    for update
    using (
      exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
          and profiles.role = 'admin'
      )
    );
end $$;
