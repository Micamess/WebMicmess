import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocialLinks } from '../hooks/useSocialLinks'

const PLATFORM_LABEL = {
  kick: 'Kick',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  discord: 'Discord',
}

function SocialLinksEditor() {
  const { links, loading, updateLink } = useSocialLinks()
  const [drafts, setDrafts] = useState({})
  const [savingKey, setSavingKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)
  const [errorKey, setErrorKey] = useState(null)

  const valueFor = (platform) => (drafts[platform] !== undefined ? drafts[platform] : links[platform] || '')

  const save = async (platform) => {
    setSavingKey(platform)
    setErrorKey(null)
    try {
      await updateLink(platform, valueFor(platform).trim())
      setSavedKey(platform)
      setTimeout(() => setSavedKey((k) => (k === platform ? null : k)), 2000)
    } catch (err) {
      console.error(err)
      setErrorKey(platform)
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) return <p className="text-xs text-ink-faint">Cargando redes...</p>

  return (
    <div className="space-y-2.5">
      {Object.keys(PLATFORM_LABEL).map((platform) => (
        <div key={platform}>
          <div className="flex gap-2">
            <span className="w-20 shrink-0 text-xs text-ink-dim pt-2.5">{PLATFORM_LABEL[platform]}</span>
            <input
              value={valueFor(platform)}
              onChange={(e) => setDrafts((d) => ({ ...d, [platform]: e.target.value }))}
              placeholder={`Link de ${PLATFORM_LABEL[platform]}`}
              className="flex-1 rounded-md border border-white/10 bg-bg-mid px-3 py-2 text-xs placeholder:text-ink-faint"
            />
            <button
              onClick={() => save(platform)}
              disabled={savingKey === platform}
              className="rounded-md bg-pink px-3 text-xs font-semibold text-[#1a0e33] disabled:opacity-60 min-w-[76px]"
            >
              {savingKey === platform ? '...' : savedKey === platform ? 'Guardado ✓' : 'Guardar'}
            </button>
          </div>
          {errorKey === platform && (
            <p className="text-[11px] text-pink-soft mt-1 ml-[88px]">
              No se pudo guardar. Revisá que estés logueada y volvé a intentar.
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function AdminLogin() {
  const { signIn, isAdmin, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError('Email o contraseña incorrectos.')
    else navigate('/zona-de-abduccion')
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="font-display text-xl">Ya estás logueada 👽</p>
        <div className="flex gap-3">
          <a href="/zona-de-abduccion" className="rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-[#1a0e33]">
            Ir a la Zona de Abducción
          </a>
          <button
            onClick={signOut}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-ink-dim hover:bg-white/5"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="w-full max-w-md bg-bg-panel border border-white/10 rounded-2xl p-5 text-left mt-4">
          <h2 className="font-display text-base mb-1">Tus redes sociales</h2>
          <p className="text-xs text-ink-faint mb-4">Pegá el link de cada red — se actualizan solas en el sitio.</p>
          <SocialLinksEditor />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-bg-panel border border-white/10 rounded-2xl p-6 space-y-3">
        <h1 className="font-display text-xl mb-1">Panel de Micamess</h1>
        <p className="text-xs text-ink-faint mb-4">Solo para administrar el sitio.</p>

        {error && <p className="rounded-md border border-pink/30 bg-pink/10 px-3 py-2 text-xs text-pink-soft">{error}</p>}

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-white/10 bg-bg-mid px-3 py-2.5 text-sm placeholder:text-ink-faint"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full rounded-md border border-white/10 bg-bg-mid px-3 py-2.5 text-sm placeholder:text-ink-faint"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-pink px-4 py-2.5 text-sm font-semibold text-[#1a0e33] disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
