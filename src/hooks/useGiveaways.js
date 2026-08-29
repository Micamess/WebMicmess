import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useGiveaways() {
  const [giveaways, setGiveaways] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('giveaways').select('*').order('created_at', { ascending: false })
    if (!error) setGiveaways(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createGiveaway = async (giveaway) => {
    const { data, error } = await supabase.from('giveaways').insert(giveaway).select().single()
    if (error) throw error
    await refresh()
    return data
  }

  const closeGiveaway = async (id, winnerUsername) => {
    const { error } = await supabase
      .from('giveaways')
      .update({ status: 'cerrado', winner_username: winnerUsername })
      .eq('id', id)
    if (error) throw error
    await refresh()
  }

  const deleteGiveaway = async (id) => {
    const { error } = await supabase.from('giveaways').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }

  return { giveaways, loading, refresh, createGiveaway, closeGiveaway, deleteGiveaway }
}
