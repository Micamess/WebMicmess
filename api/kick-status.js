// Función serverless de Vercel (no corre en el navegador — las credenciales
// de acá nunca se exponen al público). Consulta el estado del canal de Kick
// usando un "App Access Token": no requiere que Micamess autorice nada,
// porque saber si un canal está en vivo es información pública.

let cachedToken = null
let cachedTokenExpiry = 0

async function getAppAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry) return cachedToken

  const res = await fetch('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.KICK_CLIENT_ID,
      client_secret: process.env.KICK_CLIENT_SECRET,
    }),
  })

  if (!res.ok) throw new Error('No se pudo autenticar con Kick')
  const data = await res.json()
  cachedToken = data.access_token
  // Guardamos el token un minuto menos de lo que dura, como margen de seguridad
  cachedTokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

export default async function handler(req, res) {
  const slug = process.env.KICK_CHANNEL_SLUG || 'micamess'

  try {
    const token = await getAppAccessToken()
    const channelRes = await fetch(`https://api.kick.com/public/v1/channels?slug=${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!channelRes.ok) {
      return res.status(200).json({ isLive: false })
    }

    const channelData = await channelRes.json()
    const channel = channelData.data?.[0]
    const isLive = Boolean(channel?.stream?.is_live)

    res.setHeader('Cache-Control', 's-maxage=25, stale-while-revalidate=25')
    return res.status(200).json({
      isLive,
      title: channel?.stream_title ?? null,
      viewers: channel?.stream?.viewer_count ?? null,
    })
  } catch (err) {
    console.error('[kick-status]', err)
    return res.status(200).json({ isLive: false, error: true })
  }
}
