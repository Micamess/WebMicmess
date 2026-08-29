import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSocialLinks() {
  const [links, setLinks] = useState({})
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('social_links').select('*')
    if (!error && data) {
      const map = {}
      data.forEach((row) => {
        map[row.platform] = row.url
      })
      setLinks(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateLink = async (platform, url) => {
    const { error } = await supabase.from('social_links').upsert({ platform, url }, { onConflict: 'platform' })
    if (error) throw error
    await refresh()
  }

  return { links, loading, refresh, updateLink }
}
