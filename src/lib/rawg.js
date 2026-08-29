const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY

export const isRawgConfigured = Boolean(RAWG_KEY)

// Devuelve una lista chica de resultados: [{ id, name, cover }]
export async function searchGames(query) {
  if (!RAWG_KEY || !query || !query.trim()) return []
  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=6`
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.results || []).map((g) => ({
      id: g.id,
      name: g.name,
      cover: g.background_image || '',
    }))
  } catch (err) {
    console.warn('[micamess] Falló la búsqueda en RAWG', err)
    return []
  }
}
