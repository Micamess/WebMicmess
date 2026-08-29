import { useEffect, useRef, useState } from 'react'
import { X, Gamepad2 } from 'lucide-react'
import { searchGames, isRawgConfigured } from '../lib/rawg'

const emptyForm = { title: '', cover_url: '', steam_url: '', recommended_by: '', note: '' }

export default function AddRecommendedGameModal({ onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const [pickedFromRawg, setPickedFromRawg] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!isRawgConfigured || pickedFromRawg || !form.title.trim()) {
      setSuggestions([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const results = await searchGames(form.title)
      setSuggestions(results)
      setSearching(false)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [form.title, pickedFromRawg])

  const pickSuggestion = (s) => {
    setForm((f) => ({ ...f, title: s.name, cover_url: s.cover || f.cover_url }))
    setSuggestions([])
    setPickedFromRawg(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('El título es obligatorio.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onCreate({
        title: form.title.trim(),
        cover_url: form.cover_url || null,
        steam_url: form.steam_url || null,
        recommended_by: form.recommended_by || null,
        note: form.note || null,
      })
      onClose()
    } catch (err) {
      console.error(err)
      setError('No se pudo guardar la recomendación. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-bg-mid p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Agregar recomendado</h3>
          <button onClick={onClose} className="rounded-md p-1 text-ink-faint hover:bg-white/5 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-md border border-pink/30 bg-pink/10 px-3 py-2 text-xs text-pink-soft">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div className="flex gap-3">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-panel flex items-center justify-center">
              {form.cover_url ? (
                <img src={form.cover_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <Gamepad2 className="h-6 w-6 text-ink-faint" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="relative">
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => {
                    setPickedFromRawg(false)
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }}
                  placeholder="Título del juego *"
                  className="w-full rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-sm placeholder:text-ink-faint"
                  autoComplete="off"
                />
                {searching && (
                  <span className="absolute right-3 top-2.5 text-[10px] text-ink-faint">buscando...</span>
                )}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-white/10 bg-bg-panel shadow-lg">
                    {suggestions.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => pickSuggestion(s)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/5"
                      >
                        {s.cover ? (
                          <img src={s.cover} alt="" className="h-8 w-8 rounded object-cover" />
                        ) : (
                          <span className="h-8 w-8 rounded bg-bg-mid" />
                        )}
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                value={form.cover_url}
                onChange={(e) => setForm((f) => ({ ...f, cover_url: e.target.value }))}
                placeholder="URL de portada (opcional)"
                className="w-full rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-xs placeholder:text-ink-faint"
              />
            </div>
          </div>

          <input
            value={form.steam_url}
            onChange={(e) => setForm((f) => ({ ...f, steam_url: e.target.value }))}
            placeholder="Link a Steam (opcional)"
            className="w-full rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-sm placeholder:text-ink-faint"
          />
          <input
            value={form.recommended_by}
            onChange={(e) => setForm((f) => ({ ...f, recommended_by: e.target.value }))}
            placeholder="Recomendado por (opcional)"
            className="w-full rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-sm placeholder:text-ink-faint"
          />
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="Comentario (opcional)"
            rows={3}
            className="w-full resize-none rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-sm placeholder:text-ink-faint"
          />

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-pink px-4 py-2 text-sm font-semibold text-[#1a0e33] hover:brightness-95 disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar recomendación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
