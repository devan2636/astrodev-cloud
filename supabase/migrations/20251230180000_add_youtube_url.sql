-- Add youtube_url column to projects table
ALTER TABLE public.projects
ADD COLUMN
IF NOT EXISTS youtube_url TEXT;
