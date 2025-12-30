-- Add content field to projects table for detailed blog-like descriptions
ALTER TABLE public.projects 
ADD COLUMN
IF NOT EXISTS content TEXT,
ADD COLUMN
IF NOT EXISTS slug TEXT;

-- Create unique index on slug for SEO-friendly URLs
CREATE UNIQUE INDEX
IF NOT EXISTS projects_slug_unique ON public.projects
(slug);
