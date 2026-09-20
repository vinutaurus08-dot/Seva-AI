import { useNavigate } from 'react-router-dom'

const TYPE_CLASS = {
  Government: 'tag-gov',
  Foundation: 'tag-foundation',
  NGO: 'tag-ngo',
  Trust: 'tag-trust',
}

export default function SchemeCard({ scheme }) {
  const navigate = useNavigate()
  return (
    <div className="scheme-card" onClick={() => navigate(`/scheme/${scheme.id}`)}>
      <div className="scheme-card-top">
        <span className={`scheme-tag ${TYPE_CLASS[scheme.type] || 'tag-gov'}`}>
          {scheme.type}
        </span>
        {typeof scheme.matchScore === 'number' && (
          <span className="match-badge">{scheme.matchScore}% Match</span>
        )}
      </div>
      <h3 className="scheme-name">{scheme.name}</h3>
      <p className="scheme-provider">{scheme.provider}</p>
      <div className="scheme-card-bottom">
        <button
          className="apply-link"
          onClick={(e) => {
            e.stopPropagation()
            window.open(scheme.applyLink, '_blank')
          }}
        >
          Apply Now →
        </button>
      </div>
    </div>
  )
}
