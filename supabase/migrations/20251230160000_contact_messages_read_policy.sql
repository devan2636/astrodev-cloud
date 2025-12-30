-- Add policy to allow admin to read contact messages
CREATE POLICY "Admin can read contact messages"
ON public.contact_messages
FOR
SELECT
    USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
  )
);
