import { FaDiscord, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6'
import KickIcon from '../components/KickIcon'
import { useSocialLinks } from '../hooks/useSocialLinks'
import { useKickLive } from '../hooks/useKickLive'

const KICK_USERNAME = 'MicaMess'

const SOCIALS = [
  { platform: 'kick', label: 'Kick', Icon: KickIcon },
  { platform: 'instagram', label: 'Instagram', Icon: FaInstagram },
  { platform: 'tiktok', label: 'TikTok', Icon: FaTiktok },
  { platform: 'youtube', label: 'YouTube', Icon: FaYoutube },
  { platform: 'discord', label: 'Discord', Icon: FaDiscord },
]

export default function Home() {
  const { links } = useSocialLinks()
  const { isLive, title, viewers } = useKickLive()

  return (
    <div>
      <svg
        className="alien w-[70px] top-[14%] left-[8%] animate-[float_6s_ease-in-out_infinite]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="50" cy="45" rx="30" ry="34" fill="#b9a3ff" />
        <ellipse cx="38" cy="42" rx="7" ry="10" fill="#150a28" />
        <ellipse cx="62" cy="42" rx="7" ry="10" fill="#150a28" />
        <path d="M35 66c6 6 24 6 30 0" stroke="#150a28" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg
        className="alien w-[50px] top-[60%] right-[9%] animate-[float_7s_ease-in-out_infinite]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="50" cy="45" rx="30" ry="34" fill="#ff8fd6" />
        <ellipse cx="38" cy="42" rx="7" ry="10" fill="#150a28" />
        <ellipse cx="62" cy="42" rx="7" ry="10" fill="#150a28" />
        <path d="M35 66c6 6 24 6 30 0" stroke="#150a28" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden flex items-center min-h-screen px-[6vw] py-[90px]">
        <div className="hero-bg" />
        <div className="hero-scrim" />

        <div className="relative z-[2] w-full max-w-[1180px] mx-auto flex items-center justify-between gap-12 flex-wrap">
          <div className="max-w-[640px] text-center sm:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[.14em] text-mint bg-mint/[0.08] border border-mint/25 px-3.5 py-1.5 rounded-full mb-7">
              <span className="w-[7px] h-[7px] rounded-full bg-mint animate-[pulse_1.8s_infinite]" />
              Transmisión desde otro planeta
            </div>

            <h1 className="font-display font-bold leading-[0.98] text-[clamp(3.2rem,7.2vw,6.6rem)] -tracking-[0.01em]">
              Bienvenida
              <span className="block bg-gradient-to-r from-pink via-pink-soft to-lavender bg-clip-text text-transparent">
                Micamess
              </span>
            </h1>
            <p className="mt-4 text-[clamp(1rem,2.4vw,1.2rem)] text-ink-dim max-w-[460px] mx-auto sm:mx-0">
              Juegos, clips y comunidad — todo lo que pasa en el canal, reunido en un solo lugar.
            </p>

            <div className="mt-11 flex gap-3.5 flex-wrap justify-center sm:justify-start">
              <a
                href="#clips"
                className="font-bold text-[15px] px-7 py-3.5 rounded-full border-[1.5px] border-white/20 hover:border-lavender transition-colors"
              >
                Ver mejores clips
              </a>
              <a
                href="#encuestas"
                className="font-bold text-[15px] px-7 py-3.5 rounded-full border-[1.5px] border-white/20 hover:border-lavender transition-colors"
              >
                Ver encuesta en vivo
              </a>
            </div>
          </div>

          <div className="relative w-[min(46vw,300px)] shrink-0 mx-auto sm:mx-0">
            <div className={`viewport-ring ${isLive ? '' : 'opacity-60'}`} />
            <div className="viewport">
              {isLive ? (
                <>
                  <iframe
                    src={`https://player.kick.com/${KICK_USERNAME}?muted=true`}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    title="Stream en vivo de Micamess"
                  />
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[.08em] text-mint">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                    En vivo{viewers != null ? ` · ${viewers}` : ''}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[32px] animate-[float_4.5s_ease-in-out_infinite]">👽</div>
                  <div className="font-mono text-[11px] uppercase tracking-[.1em] text-ink-faint text-center">
                    Canal <b className="text-pink-soft">fuera del aire</b>
                  </div>
                  <div className="text-[11.5px] text-ink-faint max-w-[190px] text-center">
                    Se enciende sola cuando arranca el stream
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Clips ---------- */}
      <section className="relative z-[1] px-6 py-[70px] max-w-[1080px] mx-auto" id="clips">
        <div className="flex items-baseline gap-2.5 mb-5 flex-wrap">
          <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)]">🛸 Mejores clips de la semana</h2>
          <span className="font-mono text-xs text-ink-faint">próximamente</span>
        </div>
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-ink-faint text-sm">
          Micamess todavía no cargó clips esta semana. Volvé pronto 👀
        </div>
      </section>

      {/* ---------- Encuesta ---------- */}
      <section className="relative z-[1] px-6 py-[70px] max-w-[1080px] mx-auto" id="encuestas">
        <div className="flex items-baseline gap-2.5 mb-5 flex-wrap">
          <h2 className="font-display text-[clamp(1.3rem,3vw,1.7rem)]">🗳️ Encuesta en vivo</h2>
          <span className="font-mono text-xs text-ink-faint">próximamente</span>
        </div>
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-ink-faint text-sm">
          Las encuestas en vivo con el chat de Kick llegan pronto 🗳️
        </div>
      </section>

      <footer className="text-center py-10 pb-24 text-ink-faint text-xs relative z-[1]">
        Fan hub no oficial · hecho con 💜 para la comunidad de Micamess
      </footer>

      <div className="fixed z-20 flex gap-2.5 left-1/2 -translate-x-1/2 bottom-4 flex-row sm:left-5 sm:translate-x-0 sm:bottom-5 sm:flex-col">
        {SOCIALS.map(({ platform, label, Icon }) => {
          const url = links[platform]
          return (
            <a
              key={platform}
              href={url || '#'}
              target={url ? '_blank' : undefined}
              rel="noreferrer"
              title={label}
              aria-label={label}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-bg-panel/70 backdrop-blur-md border border-white/10 transition-all hover:translate-x-1 sm:hover:translate-x-1 hover:bg-pink/20 ${
                url ? 'text-ink hover:text-pink-soft' : 'text-ink-faint/40 cursor-default'
              }`}
            >
              <Icon className="w-5 h-5" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
