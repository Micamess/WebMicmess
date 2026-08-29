import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useGames } from '../hooks/useGames'
import { useRecommendedGames } from '../hooks/useRecommendedGames'
import { useAuth } from '../context/AuthContext'
import AddGameModal from '../components/AddGameModal'
import AddRecommendedGameModal from '../components/AddRecommendedGameModal'

const STATUS_LABEL = {
  jugando: 'Jugando',
  pausado: 'Pausado',
  completado: 'Terminado',
  abandonado: 'Abandonado',
}

export default function Portal() {
  const { isAdmin } = useAuth()
  const { games, loading: gamesLoading, addGame, deleteGame } = useGames()
  const { recommended, loading: recLoading, addRecommended, deleteRecommended } = useRecommendedGames()
  const [query, setQuery] = useState('')
  const [addGameOpen, setAddGameOpen] = useState(false)
  const [addRecOpen, setAddRecOpen] = useState(false)

  const filteredGames = useMemo(
    () => games.filter((g) => g.title.toLowerCase().includes(query.toLowerCase())),
    [games, query]
  )

  const totalHours = games.reduce((sum, g) => sum + Number(g.hours_played || 0), 0)
  const completados = games.filter((g) => g.status === 'completado').length
  const jugando = games.filter((g) => g.status === 'jugando').length

  return (
    <div className="min-h-screen">
      <div className="h-[76px]" />

      <div className="text-center px-6 pt-6 pb-2">
        <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)]">
          Los juegos que{' '}
          <span className="bg-gradient-to-r from-pink to-lavender bg-clip-text text-transparent">abdujeron</span> a
          Mica
        </h1>
        <p className="mt-2 text-ink-dim">Biblioteca personal + lo que la comunidad le recomienda</p>
      </div>

      <div className="max-w-[640px] mx-auto mt-8 px-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Buscar un juego..."
          className="w-full bg-bg-panel border border-white/10 rounded-2xl px-4 py-3.5 text-sm placeholder:text-ink-faint"
        />
      </div>

      <div className="flex gap-3 flex-wrap justify-center px-6 pt-8">
        <Stat value={games.length} label="en biblioteca" />
        <Stat value={jugando} label="jugando ahora" />
        <Stat value={completados} label="terminados" />
        <Stat value={`${totalHours}h`} label="totales" />
      </div>

      {/* Biblioteca */}
      <section className="px-6 py-[70px] max-w-[1080px] mx-auto">
        <div className="flex items-baseline gap-2.5 mb-5 flex-wrap">
          <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)]">🎮 Biblioteca</h2>
          <span className="font-mono text-xs text-ink-faint">{games.length}</span>
          {isAdmin && (
            <button
              onClick={() => setAddGameOpen(true)}
              className="ml-auto flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-ink-dim hover:bg-white/5"
            >
              <Plus className="h-3.5 w-3.5" /> Agregar juego
            </button>
          )}
        </div>

        {gamesLoading ? (
          <p className="text-sm text-ink-faint">Cargando...</p>
        ) : filteredGames.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-ink-faint text-sm">
            {games.length === 0 ? 'Todavía no hay juegos cargados.' : 'No encontré nada con esa búsqueda.'}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {filteredGames.map((g) => {
              const isPlaying = g.status === 'jugando'
              return (
                <div key={g.id} className={isPlaying ? 'aura-playing scale-105 my-2' : ''}>
                  <div
                    className={`group relative bg-bg-panel rounded-[18px] overflow-hidden transition-all ${
                      isPlaying
                        ? 'border-2 border-black shadow-[0_0_0_1px_rgba(185,163,255,.35)]'
                        : 'border border-white/10 hover:-translate-y-1 hover:border-lavender/40'
                    }`}
                  >
                    {isAdmin && (
                      <button
                        onClick={() => deleteGame(g.id)}
                        className="absolute right-2 top-2 z-10 rounded-md bg-black/50 p-1.5 text-white/70 opacity-0 hover:text-pink group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <div className="h-[110px] bg-gradient-to-br from-[#3a2160] to-[#23123f] flex items-center justify-center text-2xl">
                      {g.cover_url ? (
                        <img src={g.cover_url} alt={g.title} className="w-full h-full object-cover" />
                      ) : (
                        '🛰️'
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[13px] font-semibold">{g.title}</p>
                      <span
                        className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          isPlaying ? 'bg-lavender/20 text-lavender' : 'bg-mint/10 text-mint'
                        }`}
                      >
                        {STATUS_LABEL[g.status] ?? g.status}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Recomendados */}
      <section className="px-6 py-[70px] max-w-[1080px] mx-auto">
        <div className="flex items-baseline gap-2.5 mb-5 flex-wrap">
          <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)]">🎯 Recomendados por la comunidad</h2>
          <span className="font-mono text-xs text-ink-faint">{recommended.length}</span>
          {isAdmin && (
            <button
              onClick={() => setAddRecOpen(true)}
              className="ml-auto flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-ink-dim hover:bg-white/5"
            >
              <Plus className="h-3.5 w-3.5" /> Agregar recomendado
            </button>
          )}
        </div>

        {recLoading ? (
          <p className="text-sm text-ink-faint">Cargando...</p>
        ) : recommended.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-ink-faint text-sm">
            Todavía no hay recomendaciones cargadas.
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recommended.map((g) => (
              <div
                key={g.id}
                className="group relative w-56 shrink-0 bg-bg-panel border border-white/10 rounded-[18px] overflow-hidden"
              >
                {isAdmin && (
                  <button
                    onClick={() => deleteRecommended(g.id)}
                    className="absolute right-2 top-2 z-10 rounded-md bg-black/50 p-1.5 text-white/70 opacity-0 hover:text-pink group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <div className="h-28 bg-gradient-to-br from-[#3a2160] to-[#23123f] flex items-center justify-center text-2xl">
                  {g.cover_url ? (
                    <img src={g.cover_url} alt={g.title} className="w-full h-full object-cover" />
                  ) : (
                    '👾'
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1.5">
                  <p className="font-display text-sm">{g.title}</p>
                  {g.recommended_by && <p className="text-xs text-ink-faint">Recomendado por {g.recommended_by}</p>}
                  {g.note && <p className="text-xs text-ink-faint">{g.note}</p>}
                  {g.steam_url && (
                    <a
                      href={g.steam_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center justify-center rounded-lg bg-pink px-3 py-1.5 text-xs font-semibold text-[#1a0e33]"
                    >
                      Ver en Steam
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="text-center py-10 pb-16 text-ink-faint text-xs">
        Fan hub no oficial · hecho con 💜 para la comunidad de Micamess
      </footer>

      {addGameOpen && <AddGameModal onClose={() => setAddGameOpen(false)} onCreate={addGame} />}
      {addRecOpen && <AddRecommendedGameModal onClose={() => setAddRecOpen(false)} onCreate={addRecommended} />}
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="bg-bg-panel border border-white/10 rounded-2xl px-5 py-3.5 min-w-[110px] text-center">
      <b className="block font-display text-[22px] text-pink-soft">{value}</b>
      <span className="text-[11px] text-ink-faint">{label}</span>
    </div>
  )
}
