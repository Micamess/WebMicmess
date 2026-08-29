import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRecommendedGames() {
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('recommended_games')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setRecommended(data)
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addRecommended = async (game) => {
    const { data, error } = await supabase.from('recommended_games').insert(game).select().single()
    if (error) throw error
    await refresh()
    return data
  }

  const deleteRecommended = async (id) => {
    const { error } = await supabase.from('recommended_games').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }

  return { recommended, loading, error, refresh, addRecommended, deleteRecommended }
}
