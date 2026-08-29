import { createClient } from '@supabase/supabase-js'

function parseCookies(header = '') {
  const out = {}
  header.split(';').forEach((part) => {
    const [k, ...v] = part.trim().split('=')
    if (k) out[k] = decodeURIComponent(v.join('='))
  })
  return out
}

export default async function handler(req, res) {
  const { code, state } = req.query
  const cookies = parseCookies(req.headers.cookie)

  if (!code || !state || state !== cookies.kick_oauth_state || !cookies.kick_pkce_verifier) {
    res.status(400).send('Autorización inválida o expirada. Volvé a intentar desde /admin.')
    return
  }

  try {
    // 1) Cambiar el "code" por los tokens del canal de Micamess
    const tokenRes = await fetch('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KICK_CLIENT_ID,
        client_secret: process.env.KICK_CLIENT_SECRET,
        redirect_uri: process.env.KICK_REDIRECT_URI,
        code,
        code_verifier: cookies.kick_pkce_verifier,
      }),
    })
    if (!tokenRes.ok) throw new Error(`token exchange failed: ${await tokenRes.text()}`)
    const tokens = await tokenRes.json()

    // 2) Averiguar el broadcaster_user_id (con el mismo App Access Token de kick-status)
    const appTokenRes = await fetch('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.KICK_CLIENT_ID,
        client_secret: process.env.KICK_CLIENT_SECRET,
      }),
    })
    const appToken = (await appTokenRes.json()).access_token
    const slug = process.env.KICK_CHANNEL_SLUG || 'micamess'
    const channelRes = await fetch(`https://api.kick.com/public/v1/channels?slug=${slug}`, {
      headers: { Authorization: `Bearer ${appToken}` },
    })
    const channelData = await channelRes.json()
    const broadcasterId = channelData.data?.[0]?.broadcaster_user_id

    // 3) Guardar los tokens en Supabase (con la service role key, sin pasar por RLS)
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    await supabase.from('kick_connection').upsert({
      id: true,
      broadcaster_user_id: broadcasterId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      connected_at: new Date().toISOString(),
    })

    // 4) Suscribirse al evento de mensajes de chat
    const subRes = await fetch('https://api.kick.com/public/v1/events/subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: [{ name: 'chat.message.sent', version: 1 }],
        method: 'webhook',
        broadcaster_user_id: broadcasterId,
      }),
    })
    if (!subRes.ok) throw new Error(`subscribe failed: ${await subRes.text()}`)

    res.setHeader('Set-Cookie', [
      'kick_pkce_verifier=; Path=/; Max-Age=0',
      'kick_oauth_state=; Path=/; Max-Age=0',
    ])
    res.writeHead(302, { Location: '/admin?kick=connected' })
    res.end()
  } catch (err) {
    console.error('[kick-oauth-callback]', err)
    res.status(500).send('Falló la conexión con Kick. Mirá los logs de Vercel para ver el detalle exacto.')
  }
}
