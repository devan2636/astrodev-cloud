-- Allow safe download count increments via RPC
-- Security definer bypasses RLS but limits scope to public documents only.

create or replace function public.increment_document_download
(doc_id uuid)
returns void
language plpgsql
security definer
set search_path
= public
as $$
begin
    update public.documents
  set download_count = coalesce(download_count, 0) + 1
  where id = doc_id and is_public = true;
end;
$$;

-- Allow anonymous clients to call the function (uses definer privileges internally).
grant execute on function public.increment_document_download
(uuid) to anon;
