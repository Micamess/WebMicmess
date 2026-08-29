import { useState } from 'react'
import { X, Gift } from 'lucide-react'

const emptyForm = { title: '', description: '', image_url: '', keyword: '!participo' }

export default function AddGiveawayModal({ onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

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
        description: form.description || null,
        image_url: form.image_url || null,
        keyword: form.keyword.trim() || '!participo',
      })
      onClose()
    } catch (err) {
      console.error(err)
      setError('No se pudo crear el sorteo. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-bg-mid p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Crear sorteo</h3>
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
              {form.image_url ? (
                <img src={form.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <Gift className="h-6 w-6 text-ink-faint" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                autoFocus
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="¿Qué se sortea? *"
                className="w-full rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-sm placeholder:text-ink-faint"
              />
              <input
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="URL de la foto (opcional)"
                className="w-full rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-xs placeholder:text-ink-faint"
              />
            </div>
          </div>

          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Detalles del premio (opcional)"
            rows={3}
            className="w-full resize-none rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-sm placeholder:text-ink-faint"
          />

          <div>
            <input
              value={form.keyword}
              onChange={(e) => setForm((f) => ({ ...f, keyword: e.target.value }))}
              placeholder="Palabra clave en el chat"
              className="w-full rounded-md border border-white/10 bg-bg-panel px-3 py-2 text-sm placeholder:text-ink-faint"
            />
            <p className="mt-1 text-[11px] text-ink-faint">
              Por ahora esto es solo informativo — la carga automática desde el chat se activa en la Etapa 3.
            </p>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-pink px-4 py-2 text-sm font-semibold text-[#1a0e33] disabled:opacity-60"
            >
              {saving ? 'Creando...' : 'Crear sorteo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
