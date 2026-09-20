import { useNavigate, useLocation } from 'react-router-dom'

const ITEMS = [
  { label: 'Home', icon: '🏠', path: '/dashboard' },
  { label: 'Schemes', icon: '📋', path: '/schemes' },
  { label: 'Assistant', icon: '🤖', path: '/assistant' },
  { label: 'Profile', icon: '👤', path: '/me' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <nav className="bottom-nav">
      {ITEMS.map((it) => {
        const active = pathname === it.path
        return (
          <button
            key={it.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(it.path)}
          >
            <span className="nav-icon">{it.icon}</span>
            <span className="nav-label">{it.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
