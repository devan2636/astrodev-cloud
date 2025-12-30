import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

// Generic content loader for site sections stored in public.site_content
export function useSectionContent<T>(section: string, fallback: T): T {
  const [content, setContent] = useState<T>(fallback)

  useEffect(() => {
    let isMounted = true

    async function load() {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section', section)
        .maybeSingle()

      if (error || !data?.content || !isMounted) return
      setContent(data.content as T)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [section])

  return content
}
