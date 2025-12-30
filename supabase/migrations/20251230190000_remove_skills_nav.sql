-- Remove Skills from navigation in hero content
UPDATE public.site_content
SET content = jsonb_set(
  content,
  '{navLinks}',
  (
    SELECT jsonb_agg(elem)
FROM jsonb_array_elements(content->'navLinks') elem
WHERE elem->>'label' != 'Skills'
  )
)
WHERE section = 'hero'
    AND content->'navLinks'
IS NOT NULL;

-- Update socials with correct links
UPDATE public.site_content
SET content = jsonb_set(
  jsonb_set(
    jsonb_set(
      content,
      '{socials,0,href}',
      '"https://github.com/devan2636"'
    ),
    '{socials,1,href}',
    '"https://www.linkedin.com/in/devandrisuherman"'
  ),
  '{socials,2,href}',
  '"mailto:devandrisuherman9@gmail.com"'
)
WHERE section = 'hero'
    AND content->'socials'
IS NOT NULL;
