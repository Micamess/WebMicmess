// Kick todavía no tiene ícono oficial en react-icons, así que armamos uno
// propio simple (una marca "K" en un cuadrado redondeado) para el dock.
export default function KickIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 6h2.6v4.3L13.2 6H16l-4.4 5.6L16.4 18h-2.9l-3.9-5.1v5.1H7V6z" />
    </svg>
  )
}
