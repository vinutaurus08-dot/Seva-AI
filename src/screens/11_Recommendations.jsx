import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import SchemeCard from '../components/SchemeCard.jsx'
import { useProfile } from '../context/ProfileContext.jsx'

const FILTERS = ['All', 'Scholarship', 'Government', 'Foundation', 'NGO', 'Trust']

export default function Recommendations() {
  const navigate = useNavigate()
  const { recommendations } = useProfile()
  const [filter, setFilter] = useState('All')

  const list =
    filter === 'All' ? recommendations : recommendations.filter((s) => s.type === filter)

  return (
    <div className="screen has-nav">
      <header className="sub-header">
        <button className="back-btn light" onClick={() => navigate('/dashboard')}>←</button>
        <h2>Recommended For You</h2>
      </header>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'on' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="dash-body">
        <p className="result-count">{list.length} eligible scheme{list.length !== 1 ? 's' : ''}</p>
        {list.length ? (
          list.map((s) => <SchemeCard key={s.id} scheme={s} />)
        ) : (
          <p className="empty-note">No schemes in this category for your profile.</p>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
