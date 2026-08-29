import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import Home from './pages/Home'
import Portal from './pages/Portal'
import Giveaways from './pages/Giveaways'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-screen text-ink font-sans">
          <div className="stars" />
          <div className="glow-a" />
          <div className="glow-b" />
          <Nav />
          <div className="relative z-[1]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/zona-de-abduccion" element={<Portal />} />
              <Route path="/sorteos" element={<Giveaways />} />
              <Route path="/admin" element={<AdminLogin />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
