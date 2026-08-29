import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useGiveawayEntries(giveawayId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!giveawayId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('giveaway_entries')
      .select('*')
      .eq('giveaway_id', giveawayId)
      .order('created_at', { ascending: true })
    if (!error) setEntries(data)
    setLoading(false)
  }, [giveawayId])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Carga manual (solo admin) — mientras no esté conectado el lector de chat,
  // sirve para probar el sorteo. Cuando la Etapa 3 esté lista, el webhook va a
  // insertar acá automáticamente cada vez que alguien escriba la palabra clave.
  const addEntry = async (kickUsername) => {
    const { error } = await supabase
      .from('giveaway_entries')
      .insert({ giveaway_id: giveawayId, kick_username: kickUsername.trim() })
    if (error) throw error
    await refresh()
  }

  const removeEntry = async (id) => {
    const { error } = await supabase.from('giveaway_entries').delete().eq('id', id)
    if (error) throw error
    await refresh()
  }

  return { entries, loading, refresh, addEntry, removeEntry }
}
