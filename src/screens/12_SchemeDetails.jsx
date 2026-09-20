import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSchemeById } from '../data/schemes.js'

const TABS = ['Overview', 'Eligibility', 'Documents', 'How to Apply']

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function SchemeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const scheme = getSchemeById(id)
  const [tab, setTab] = useState('Overview')

  if (!scheme) {
    return (
      <div className="screen pad">
        <p>Scheme not found.</p>
        <button className="btn-primary" onClick={() => navigate('/schemes')}>Back to Schemes</button>
      </div>
    )
  }

  const e = scheme.eligibility

  return (
    <div className="screen has-footer">
      <header className="sub-header purple">
        <button className="back-btn light" onClick={() => navigate(-1)}>←</button>
        <h2>{scheme.type} Scheme</h2>
        <span className="match-badge light">{scheme.matchScore ?? ''}{scheme.matchScore ? '% Match' : ''}</span>
      </header>

      <div className="detail-title-wrap">
        <h1 className="detail-title">{scheme.name}</h1>
        <p className="detail-provider">{scheme.provider}</p>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="detail-body">
        {tab === 'Overview' && (
          <>
            <h4>About</h4>
            <p>{scheme.description}</p>
            <h4>Benefits</h4>
            <ul className="bullet">{scheme.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
            <h4>Last Date to Apply</h4>
            <p className="highlight-date">🗓️ {fmtDate(scheme.lastDate)}</p>
            <h4>Contact</h4>
            <p>☎️ {scheme.contact}</p>
          </>
        )}

        {tab === 'Eligibility' && (
          <>
            <h4>Who can apply</h4>
            <ul className="bullet">
              {e.occupations.length > 0 && <li>Occupation: {e.occupations.join(', ')}</li>}
              {e.categories.length > 0 && <li>Category: {e.categories.join(', ')}</li>}
              {e.genders.length > 0 && <li>Gender: {e.genders.join(', ')}</li>}
              {e.maxIncome != null && <li>Annual income up to ₹{e.maxIncome.toLocaleString('en-IN')}</li>}
              {(e.minAge != null || e.maxAge != null) && (
                <li>Age: {e.minAge ?? 'any'} – {e.maxAge ?? 'any'} years</li>
              )}
              {e.states.length > 0 && <li>States: {e.states.join(', ')}</li>}
              {e.occupations.length === 0 &&
                e.categories.length === 0 &&
                e.maxIncome == null && <li>Open to all eligible citizens</li>}
            </ul>
            {scheme.matchReasons?.length > 0 && (
              <>
                <h4>Why this matches you</h4>
                <ul className="bullet success">
                  {scheme.matchReasons.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </>
            )}
          </>
        )}

        {tab === 'Documents' && (
          <>
            <h4>Required Documents</h4>
            <ul className="bullet">{scheme.documents.map((d) => <li key={d}>{d}</li>)}</ul>
            {scheme.certificates.length > 0 && (
              <>
                <h4>Required Certificates</h4>
                <ul className="bullet">{scheme.certificates.map((c) => <li key={c}>{c}</li>)}</ul>
              </>
            )}
          </>
        )}

        {tab === 'How to Apply' && (
          <>
            <h4>Step-by-Step Process</h4>
            <ol className="numbered">{scheme.applicationSteps.map((s) => <li key={s}>{s}</li>)}</ol>
            <h4>Common Mistakes to Avoid</h4>
            <ul className="bullet warn">{scheme.commonMistakes.map((m) => <li key={m}>{m}</li>)}</ul>
            <h4>Official Website</h4>
            <a className="ext-link" href={scheme.officialWebsite} target="_blank" rel="noreferrer">
              {scheme.officialWebsite}
            </a>
          </>
        )}
      </div>

      <div className="footer-bar two">
        <button className="btn-ghost" onClick={() => navigate(`/chatbot/${scheme.id}`)}>
          🤖 Ask AI
        </button>
        <button
          className="btn-primary full"
          onClick={() => window.open(scheme.applyLink, '_blank')}
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}
