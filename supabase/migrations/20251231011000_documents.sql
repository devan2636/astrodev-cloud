-- Create documents table for shared files
create table
if not exists public.documents
(
  id uuid primary key default gen_random_uuid
(),
  name text not null,
  google_drive_url text not null,
  password text not null,
  description text,
  file_size text,
  created_at timestamptz not null default now
(),
  updated_at timestamptz not null default now
(),
  display_order int default 0
);

alter table public.documents enable row level security;

-- Public can read documents (password check will be done in client)
create policy "Documents readable by everyone"
  on public.documents
  for
select
    using (true);

-- Admin can insert documents
create policy "Admin can insert documents"
  on public.documents
  for
insert
  with check
    (
    exists (
    sele
  from public.profil
where profiles.id = auth.uid()
    and profiles.role = 'admin'
    )
);

-- Admin can update documents
create policy "Admin can update documents"
  on public.documents
  for
update
  using (
    exists (
      select 1
from public.profiles
where profiles.id = auth.uid()
    and profiles.role = 'admin'
    )
);

-- Admin can delete documents
create policy "Admin can delete documents"
  on public.documents
  for
delete
  using (
    exists
(
      select 1
from public.profiles
where profiles.id = auth.uid()
    and profiles.role = 'admin'
    )
);

-- Trigger for updated_at
drop trigger if exists update_documents_updated_at
on public.documents;
create trigger update_documents_updated_at
  before
update on public.documents
  for each row
execute
function public.update_updated_at_column
();
