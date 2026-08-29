# Micamess — sitio del canal

## Setup rápido

1. Creá un proyecto en https://supabase.com (con la cuenta nueva).
2. SQL Editor → New query → pegá todo `schema.sql` → Run.
3. Authentication → Users → Add user → creá el usuario de Micamess (email + contraseña),
   con "Auto Confirm User" tildado.
4. Authentication → Settings → desactivá "Allow new users to sign up" (no hace falta,
   solo ella entra).
5. Project Settings → API Keys → copiá el "Project URL" (SIN /rest/v1/ al final) y la
   "anon public key" completa.
6. Copiá `.env.example` a `.env` y completá los valores de Supabase.
7. (Opcional pero recomendado) Conseguí gratis una API key en https://rawg.io/apidocs
   y pegala en `VITE_RAWG_API_KEY` — sin esto, la búsqueda automática de portadas
   al escribir el título queda desactivada, pero se puede seguir cargando todo a mano.
8. `npm install`
9. `npm run dev` → abrí `http://localhost:5173`

## Páginas

- `/` — Inicio (landing pública)
- `/zona-de-abduccion` — Biblioteca de juegos + recomendados (pública para ver)
- `/admin` — Login de Micamess (no aparece en ningún menú; para administrar hay que
  entrar a esta URL directamente y loguearse). Una vez logueada, en `/zona-de-abduccion`
  le van a aparecer los botones "Agregar juego" y "Agregar recomendado".

## Deploy

Mismo flujo que cualquier proyecto Vite: subir a GitHub, importar en Vercel, cargar
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como variables de entorno ahí también.

## Redes sociales

Los botones del dock (Discord, Instagram, Kick, YouTube, TikTok) arrancan sin link
cargado. Micamess los completa desde `/admin` una vez logueada — ahí tiene un
formulario para pegar cada URL, se guardan en la base y se actualizan solas en el
sitio, sin tocar código.

## Stream en vivo (Kick)

La ventanilla de la home consulta sola si el canal está en vivo — no requiere que
Micamess autorice nada, es información pública. Para activarlo:

1. Entrá a https://kick.com/settings/developer (con tu cuenta, la del proyecto)
   y creá una app nueva. Te va a dar un `Client ID` y un `Client Secret`.
2. Estas dos claves van SOLO en Vercel (Project Settings → Environment Variables),
   nunca con el prefijo `VITE_` y nunca en el `.env` del frontend — son secretas,
   las usa la función `api/kick-status.js` del lado del servidor:
   - `KICK_CLIENT_ID`
   - `KICK_CLIENT_SECRET`
   - `KICK_CHANNEL_SLUG` = `micamess` (opcional, ya viene con ese valor por defecto)
3. En local (`npm run dev` normal, sin Vercel) esta parte no funciona — el sitio
   simplemente va a mostrar "fuera del aire" siempre, sin romperse. Para probarla
   de verdad hace falta que esté desplegado en Vercel (o correr `vercel dev` con
   la CLI de Vercel instalada).

## Sorteos

`/sorteos` — Micamess crea un sorteo (foto, qué se sortea, palabra clave para el
chat), y los participantes se listan ahí. Por ahora la carga de participantes es
manual (ella puede sumarlos a mano desde el panel, para probar el sorteo) — la
carga automática cuando alguien escribe la palabra clave en el chat de Kick se
activa recién en la Etapa 3 (lector de chat), que además va a servir para las
encuestas y el juego de palabra del día.

## Nota sobre schema.sql

Si ya habías corrido `schema.sql` antes de esta versión, correlo de nuevo — es
seguro, no borra nada existente, solo agrega la tabla nueva `social_links` que
faltaba (usa `create table if not exists` y `on conflict do nothing`).

## Pendiente (próximas etapas)

- Lector de chat (webhooks) para encuestas en vivo, sorteos automáticos y el
  juego de "palabra del día"
- Clips de la semana con reacciones
