-- Table for storing contact form messages
CREATE TABLE public.contact_messages
(
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP
  WITH TIME ZONE NOT NULL DEFAULT now
  ()
);

  -- Enable RLS
  ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

  -- Allow anyone to insert messages (public contact form)
  CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  FOR
  INSERT
  WITH CHECK
    (true)
  ;

  -- Table for portfolio projects (managed by admin, public read)
  CREATE TABLE public.projects
  (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    tags TEXT
    [] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP
    WITH TIME ZONE NOT NULL DEFAULT now
    (),
  updated_at TIMESTAMP
    WITH TIME ZONE NOT NULL DEFAULT now
    ()
);

    -- Enable RLS
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

    -- Anyone can view projects
    CREATE POLICY "Projects are viewable by everyone"
  ON public.projects
  FOR
    SELECT
      USING (true);

    -- Table for shared documents
    CREATE TABLE public.documents
    (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,
      download_count INTEGER DEFAULT 0,
      is_public BOOLEAN DEFAULT true,
      created_at TIMESTAMP
      WITH TIME ZONE NOT NULL DEFAULT now
      (),
  updated_at TIMESTAMP
      WITH TIME ZONE NOT NULL DEFAULT now
      ()
);

      -- Enable RLS
      ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

      -- Anyone can view public documents
      CREATE POLICY "Public documents are viewable by everyone"
  ON public.documents
  FOR
      SELECT
        USING (is_public = true);

      -- Create storage bucket for documents (idempotent)
      DO $$
      BEGIN
        IF NOT EXISTS (
    SELECT 1
        FROM storage.buckets
        WHERE id = 'documents'
  ) THEN
        INSERT INTO storage.buckets
          (id, name, public)
        VALUES
          ('documents', 'documents', true);
      END
      IF;
END $$;

      -- Allow public read access to documents bucket (idempotent)
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Public documents are accessible'
        ) THEN
        DROP POLICY "Public documents are accessible" ON storage.objects;
      END
      IF;
        CREATE POLICY "Public documents are accessible"
          ON storage.objects
          FOR
      SELECT
        USING (bucket_id = 'documents');
      END $$;

      -- Create function to update timestamps
      CREATE OR REPLACE FUNCTION public.update_updated_at_column
      ()
RETURNS TRIGGER AS $$
      BEGIN
  NEW.updated_at = now
      ();
      RETURN NEW;
      END;
$$ LANGUAGE plpgsql
      SET search_path
      = public;

      -- Create triggers for automatic timestamp updates
      CREATE TRIGGER update_projects_updated_at
  BEFORE
      UPDATE ON public.projects
  FOR EACH ROW
      EXECUTE
      FUNCTION public.update_updated_at_column
      ();

      CREATE TRIGGER update_documents_updated_at
  BEFORE
      UPDATE ON public.documents
  FOR EACH ROW
      EXECUTE
      FUNCTION public.update_updated_at_column
      ();