import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const { data } = await supabase.from('kick_connection').select('connected_at').eq('id', true).maybeSingle()
    res.status(200).json({ connected: Boolean(data) })
  } catch (err) {
    console.error('[kick-connection-status]', err)
    res.status(200).json({ connected: false })
  }
}
