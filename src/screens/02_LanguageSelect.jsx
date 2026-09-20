import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LANGUAGES } from '../data/languages.js'
import { useProfile } from '../context/ProfileContext.jsx'

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { language, setLanguage } = useProfile()
  const [selected, setSelected] = useState(language)

  return (
    <div className="screen pad">
      <h2 className="screen-title">Choose Your Language</h2>
      <p className="screen-sub">Select your preferred language</p>

      <div className="lang-list">
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            className={`lang-card ${selected === l.id ? 'selected' : ''}`}
            onClick={() => setSelected(l.id)}
          >
            <span className="lang-initial">{l.initial}</span>
            <span className="lang-label">{l.native}</span>
            {selected === l.id && <span className="lang-check">●</span>}
          </button>
        ))}
      </div>

      <button
        className="btn-primary btn-bottom"
        onClick={() => {
          setLanguage(selected)
          navigate('/login')
        }}
      >
        Continue
      </button>
    </div>
  )
}
