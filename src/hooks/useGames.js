import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setGames(data)
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addGame = async (game) => {
    const { data, error } = await supabase.from('games').insert(game).select().single()
    if (error) throw error
    await refresh()
    return data
  }

  const deleteGame = async (id) => {
    const { error } = await supabase.from('games').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }

  return { games, loading, error, refresh, addGame, deleteGame }
}
