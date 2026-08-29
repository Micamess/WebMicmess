import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Necesitamos el body crudo (sin parsear) para poder verificar la firma
export const config = { api: { bodyParser: false } }

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

let cachedPublicKey = null

async function getKickPublicKey() {
  if (cachedPublicKey) return cachedPublicKey
  const res = await fetch('https://api.kick.com/public/v1/public-key')
  const data = await res.json()
  cachedPublicKey = data.public_key
  return cachedPublicKey
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const rawBody = await readRawBody(req)
  const messageId = req.headers['kick-event-message-id']
  const timestamp = req.headers['kick-event-message-timestamp']
  const signature = req.headers['kick-event-signature']
  const eventType = req.headers['kick-event-type']

  // Verificación de firma: si algo no coincide, no seguimos.
  // NOTA: el formato exacto de qué se firma (mensaje = messageId.timestamp.body)
  // sigue el patrón estándar más común, pero no pude confirmarlo 100% contra la
  // documentación oficial de Kick (el sitio bloquea el acceso automático). Si
  // los primeros mensajes reales llegan y esto rechaza todo, avisame para
  // ajustar el formato exacto mirando docs.kick.com/events/webhook-security.
  try {
    const publicKey = await getKickPublicKey()
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update(`${messageId}.${timestamp}.${rawBody}`)
    const isValid = verifier.verify(publicKey, signature, 'base64')
    if (!isValid) {
      console.warn('[kick-webhook] firma inválida, evento ignorado')
      return res.status(200).end()
    }
  } catch (err) {
    console.error('[kick-webhook] error verificando firma', err)
    return res.status(200).end()
  }

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Evitar procesar el mismo mensaje dos veces (Kick puede reintentar)
  const { error: dupError } = await supabase.from('webhook_events_seen').insert({ message_id: messageId })
  if (dupError) return res.status(200).end() // ya lo vimos antes

  if (eventType === 'chat.message.sent') {
    try {
      const payload = JSON.parse(rawBody)
      const content = (payload.content || '').trim().toLowerCase()
      const username = payload.sender?.username

      if (username && content) {
        const { data: activeGiveaways } = await supabase
          .from('giveaways')
          .select('id, keyword')
          .eq('status', 'abierto')

        for (const g of activeGiveaways || []) {
          if (content === (g.keyword || '').toLowerCase()) {
            await supabase
              .from('giveaway_entries')
              .insert({ giveaway_id: g.id, kick_username: username })
              .then(
                () => {},
                () => {} // ignoramos si ya estaba anotada (constraint unique)
              )
          }
        }
      }
    } catch (err) {
      console.error('[kick-webhook] error procesando mensaje', err)
    }
  }

  res.status(200).end()
}
