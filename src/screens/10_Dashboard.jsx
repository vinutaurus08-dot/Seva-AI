import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import SchemeCard from '../components/SchemeCard.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { getProfileScore, getUpcomingDeadlines } from '../lib/recommend.js'

const QUICK = [
  { label: 'Scholarships', icon: '🎓', type: 'Scholarship' },
  { label: 'Govt Schemes', icon: '🏛️', type: 'Government' },
  { label: 'AI Chatbot', icon: '🤖', type: 'chatbot' },
  { label: 'My Applications', icon: '📑', type: 'apps' },
]

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile, recommendations } = useProfile()
  const score = getProfileScore(profile, recommendations)
  const deadlines = getUpcomingDeadlines(recommendations)
  const top = recommendations.slice(0, 4)
  const firstName = (profile.fullName || 'Citizen').split(' ')[0]

  return (
    <div className="screen has-nav">
      <header className="dash-header">
        <div>
          <p className="dash-greet">Hello, {firstName} 👋</p>
          <p className="dash-sub">Here are schemes curated for you</p>
        </div>
        <button className="bell" onClick={() => navigate('/schemes')}>🔔</button>
      </header>

      <div className="dash-body">
        <div className="score-card">
          <div>
            <p className="score-label">Recommendation Score</p>
            <p className="score-value">{score}%</p>
            <p className="score-note">
              {recommendations.length
                ? `Great! You are eligible for ${recommendations.length} schemes`
                : 'Complete your profile to see matches'}
            </p>
          </div>
          <div className="score-bot">🤖</div>
        </div>

        <h3 className="section-title">Quick Access</h3>
        <div className="quick-grid">
          {QUICK.map((q) => (
            <button
              key={q.label}
              className="quick-item"
              onClick={() => {
                if (q.type === 'chatbot') navigate('/assistant')
                else if (q.type === 'apps') navigate('/schemes')
                else navigate('/schemes')
              }}
            >
              <span className="quick-icon">{q.icon}</span>
              <span className="quick-label">{q.label}</span>
            </button>
          ))}
        </div>

        <div className="section-head">
          <h3 className="section-title">Recommended For You</h3>
          <button className="link-btn" onClick={() => navigate('/schemes')}>View All</button>
        </div>

        {top.length ? (
          top.map((s) => <SchemeCard key={s.id} scheme={s} />)
        ) : (
          <p className="empty-note">No matching schemes yet. Update your profile to get recommendations.</p>
        )}

        {deadlines.length > 0 && (
          <>
            <h3 className="section-title">⏰ Deadline Alerts</h3>
            <div className="deadline-list">
              {deadlines.map((s) => (
                <div key={s.id} className="deadline-item" onClick={() => navigate(`/scheme/${s.id}`)}>
                  <span className="deadline-name">{s.name}</span>
                  <span className="deadline-date">{fmtDate(s.lastDate)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
