import { useEffect, useState } from 'react'

export function useKickLive() {
  const [status, setStatus] = useState({ isLive: false, loading: true })

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        const res = await fetch('/api/kick-status')
        if (!res.ok) throw new Error('bad response')
        const data = await res.json()
        if (!cancelled) setStatus({ ...data, loading: false })
      } catch {
        // En local (npm run dev sin Vercel) esta ruta no existe todavía —
        // lo tratamos como "no está en vivo" en vez de romper la página.
        if (!cancelled) setStatus({ isLive: false, loading: false })
      }
    }

    check()
    const interval = setInterval(check, 45000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return status
}
