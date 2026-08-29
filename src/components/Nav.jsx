import { NavLink } from 'react-router-dom'

const linkBase =
  'text-[13px] font-semibold px-4 py-2 rounded-full transition-colors text-ink-dim hover:text-ink'
const linkActive = '!bg-gradient-to-r !from-pink !to-lavender !text-[#1a0e33]'

export default function Nav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-[6vw] py-5 bg-gradient-to-b from-bg-deep/70 to-transparent">
      <div className="font-display font-bold text-[17px] hidden sm:block">👾 Micamess</div>
      <div className="flex gap-1 bg-bg-panel/55 backdrop-blur-md border border-white/10 rounded-full p-1.5">
        <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
          Inicio
        </NavLink>
        <NavLink to="/zona-de-abduccion" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
          Zona de Abducción
        </NavLink>
        <NavLink to="/sorteos" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}>
          Sorteos
        </NavLink>
        <NavLink to="/#encuestas" className={linkBase}>
          Encuestas
        </NavLink>
      </div>
    </div>
  )
}
