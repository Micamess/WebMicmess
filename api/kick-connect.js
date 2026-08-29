import crypto from 'crypto'

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export default function handler(req, res) {
  const codeVerifier = base64url(crypto.randomBytes(32))
  const codeChallenge = base64url(crypto.createHash('sha256').update(codeVerifier).digest())
  const state = base64url(crypto.randomBytes(16))

  const cookieOpts = 'Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600'
  res.setHeader('Set-Cookie', [
    `kick_pkce_verifier=${codeVerifier}; ${cookieOpts}`,
    `kick_oauth_state=${state}; ${cookieOpts}`,
  ])

  const params = new URLSearchParams({
    client_id: process.env.KICK_CLIENT_ID,
    redirect_uri: process.env.KICK_REDIRECT_URI,
    response_type: 'code',
    scope: 'events:subscribe',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  })

  res.writeHead(302, { Location: `https://id.kick.com/oauth/authorize?${params.toString()}` })
  res.end()
}
