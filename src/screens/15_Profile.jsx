import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { DEMO_PROFILES } from '../data/demoProfiles.js'
import { OCCUPATIONS } from '../data/occupations.js'

function occLabel(id) {
  return OCCUPATIONS.find((o) => o.id === id)?.label || id || '—'
}

export default function Profile() {
  const navigate = useNavigate()
  const { profile, recommendations, loadProfile, logout } = useProfile()
  const firstName = (profile.fullName || 'Citizen').split(' ')[0]

  const handleLogout = () => {
    if (window.confirm('Log out of SevaAI? Your profile will be cleared.')) {
      logout()
      navigate('/login', { replace: true })
    }
  }

  const rows = [
    ['Full Name', profile.fullName || '—'],
    ['Age', profile.age ?? '—'],
    ['Gender', profile.gender || '—'],
    ['Education', profile.education || '—'],
    ['Occupation', `${occLabel(profile.occupation)}${profile.subOccupation ? ' · ' + profile.subOccupation : ''}`],
    ['Category', profile.category || '—'],
    ['Annual Income', profile.income ? `₹${Number(profile.income).toLocaleString('en-IN')}` : '—'],
    ['State', profile.state || '—'],
    ['District', profile.district || '—'],
    ['Disability', profile.disability ? 'Yes' : 'No'],
  ]

  return (
    <div className="screen has-nav">
      <header className="sub-header purple">
        <button className="back-btn light" onClick={() => navigate('/dashboard')}>←</button>
        <h2>My Profile</h2>
      </header>

      <div className="dash-body">
        <div className="profile-hero">
          <div className="profile-avatar">{firstName[0]?.toUpperCase() || '?'}</div>
          <div>
            <h3 className="profile-name">{profile.fullName || 'Guest User'}</h3>
            <p className="profile-eligible">✅ Eligible for {recommendations.length} schemes</p>
          </div>
        </div>

        <h3 className="section-title">Switch Demo Profile</h3>
        <p className="screen-sub small">Load a different citizen to see how recommendations change.</p>
        <div className="demo-grid">
          {DEMO_PROFILES.map((d) => {
            const active = profile.fullName === d.profile.fullName
            return (
              <button
                key={d.id}
                className={`demo-chip ${active ? 'active' : ''}`}
                onClick={() => loadProfile(d.profile)}
              >
                <span className="demo-emoji">{d.emoji}</span>
                <span className="demo-name">{d.label}</span>
                <span className="demo-tag">{d.tag}</span>
              </button>
            )
          })}
        </div>

        <h3 className="section-title">Profile Details</h3>
        <div className="detail-rows">
          {rows.map(([k, v]) => (
            <div className="detail-row" key={k}>
              <span className="dr-key">{k}</span>
              <span className="dr-val">{v}</span>
            </div>
          ))}
        </div>

        <button className="btn-ghost full" onClick={() => navigate('/profile-steps')}>
          Edit Profile
        </button>
        <button className="btn-logout full" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
