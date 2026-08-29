import { useState } from 'react'
import { Gift, Plus, Trash2, Sparkles } from 'lucide-react'
import { useGiveaways } from '../hooks/useGiveaways'
import { useGiveawayEntries } from '../hooks/useGiveawayEntries'
import { useAuth } from '../context/AuthContext'
import AddGiveawayModal from '../components/AddGiveawayModal'

export default function Giveaways() {
  const { isAdmin } = useAuth()
  const { giveaways, loading, createGiveaway, closeGiveaway, deleteGiveaway } = useGiveaways()
  const [addOpen, setAddOpen] = useState(false)

  const active = giveaways.find((g) => g.status === 'abierto')
  const past = giveaways.filter((g) => g.status === 'cerrado')

  return (
    <div className="min-h-screen">
      <div className="h-[76px]" />

      <div className="text-center px-6 pt-6 pb-2">
        <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)]">
          <span className="bg-gradient-to-r from-pink to-lavender bg-clip-text text-transparent">Sorteos</span> del
          canal
        </h1>
        <p className="mt-2 text-ink-dim">Participá escribiendo la palabra clave en el chat de Kick</p>
      </div>

      <section className="px-6 py-10 max-w-[640px] mx-auto">
        {loading ? (
          <p className="text-center text-sm text-ink-faint">Cargando...</p>
        ) : active ? (
          <ActiveGiveaway giveaway={active} isAdmin={isAdmin} onClose={closeGiveaway} onDelete={deleteGiveaway} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center text-ink-faint text-sm">
            No hay ningún sorteo activo ahora mismo. Volvé pronto 🎁
          </div>
        )}

        {isAdmin && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setAddOpen(true)}
              disabled={Boolean(active)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-ink-dim hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
              {active ? 'Ya hay un sorteo activo' : 'Crear sorteo'}
            </button>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="px-6 py-10 max-w-[720px] mx-auto">
          <div className="flex items-baseline gap-2.5 mb-5">
            <h2 className="font-display text-lg">🏆 Sorteos anteriores</h2>
            <span className="font-mono text-xs text-ink-faint">{past.length}</span>
          </div>
          <div className="space-y-3">
            {past.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-3 bg-bg-panel border border-white/10 rounded-xl p-3"
              >
                <div className="h-12 w-12 shrink-0 rounded-lg bg-bg-mid overflow-hidden flex items-center justify-center">
                  {g.image_url ? (
                    <img src={g.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Gift className="h-5 w-5 text-ink-faint" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{g.title}</p>
                  <p className="text-xs text-mint">
                    Ganador: {g.winner_username || 'sin definir'}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteGiveaway(g.id)}
                    className="text-ink-faint hover:text-pink p-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="text-center py-10 pb-16 text-ink-faint text-xs">
        Fan hub no oficial · hecho con 💜 para la comunidad de Micamess
      </footer>

      {addOpen && <AddGiveawayModal onClose={() => setAddOpen(false)} onCreate={createGiveaway} />}
    </div>
  )
}

function ActiveGiveaway({ giveaway, isAdmin, onClose, onDelete }) {
  const { entries, addEntry, removeEntry } = useGiveawayEntries(giveaway.id)
  const [manualName, setManualName] = useState('')
  const [picking, setPicking] = useState(false)

  const addManual = async (e) => {
    e.preventDefault()
    if (!manualName.trim()) return
    try {
      await addEntry(manualName)
      setManualName('')
    } catch (err) {
      console.error(err)
    }
  }

  const pickWinner = async () => {
    if (entries.length === 0) return
    setPicking(true)
    const winner = entries[Math.floor(Math.random() * entries.length)]
    setTimeout(async () => {
      await onClose(giveaway.id, winner.kick_username)
      setPicking(false)
    }, 1200)
  }

  return (
    <div className="bg-bg-panel border border-white/10 rounded-3xl overflow-hidden">
      <div className="h-52 bg-gradient-to-br from-[#3a2160] to-[#23123f] flex items-center justify-center">
        {giveaway.image_url ? (
          <img src={giveaway.image_url} alt={giveaway.title} className="h-full w-full object-cover" />
        ) : (
          <Gift className="h-10 w-10 text-ink-faint" />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.1em] text-mint mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
          Sorteo abierto
        </div>
        <h3 className="font-display text-2xl mb-2">{giveaway.title}</h3>
        {giveaway.description && <p className="text-sm text-ink-dim mb-4">{giveaway.description}</p>}

        <div className="rounded-xl bg-bg-mid border border-white/10 px-4 py-3 text-sm mb-5">
          Escribí <b className="text-pink-soft">{giveaway.keyword}</b> en el chat de Kick para participar
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-ink-faint">Participantes</span>
          <span className="font-mono text-sm text-ink">{entries.length}</span>
        </div>

        {entries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-28 overflow-y-auto">
            {entries.map((e) => (
              <span
                key={e.id}
                className="group inline-flex items-center gap-1 text-[11px] bg-bg-mid border border-white/10 rounded-full px-2.5 py-1"
              >
                {e.kick_username}
                {isAdmin && (
                  <button onClick={() => removeEntry(e.id)} className="opacity-40 hover:opacity-100 hover:text-pink">
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="border-t border-white/10 pt-4 mt-2 space-y-3">
            <form onSubmit={addManual} className="flex gap-2">
              <input
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Agregar participante a mano (para probar)"
                className="flex-1 rounded-md border border-white/10 bg-bg-mid px-3 py-2 text-xs placeholder:text-ink-faint"
              />
              <button type="submit" className="rounded-md border border-white/15 px-3 text-xs text-ink-dim hover:bg-white/5">
                Sumar
              </button>
            </form>

            <div className="flex gap-2">
              <button
                onClick={pickWinner}
                disabled={entries.length === 0 || picking}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-pink px-4 py-2.5 text-sm font-semibold text-[#1a0e33] disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                {picking ? 'Eligiendo...' : 'Elegir ganador y cerrar sorteo'}
              </button>
              <button
                onClick={() => onDelete(giveaway.id)}
                className="rounded-lg border border-white/15 px-3 text-ink-faint hover:text-pink"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
