import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { OCCUPATIONS } from '../data/occupations.js'

export default function OccupationDetails() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const [occupation, setOccupation] = useState(profile.occupation)
  const [subOccupation, setSubOccupation] = useState(profile.subOccupation)

  const current = OCCUPATIONS.find((o) => o.id === occupation)

  const next = () => {
    updateProfile({ occupation, subOccupation })
    navigate('/profile/additional')
  }

  return (
    <div className="screen pad has-footer">
      <StepIndicator current={3} />
      <h2 className="screen-title">Occupation Details</h2>
      <p className="screen-sub">Select the citizen category that fits you best</p>

      <label className="field-label">Main Category (Who are you?)</label>
      <select
        className="text-field"
        value={occupation}
        onChange={(e) => {
          setOccupation(e.target.value)
          setSubOccupation('')
        }}
      >
        <option value="">Select main category</option>
        {OCCUPATIONS.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>

      <label className="field-label">Sub Category</label>
      <select
        className="text-field"
        value={subOccupation}
        disabled={!current}
        onChange={(e) => setSubOccupation(e.target.value)}
      >
        <option value="">{current ? 'Select sub category' : 'Select a main category first'}</option>
        {current?.sub.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="info-box">
        <div className="info-title">Main Categories include:</div>
        <div className="chip-cloud">
          {OCCUPATIONS.map((o) => (
            <span key={o.id} className={`mini-chip ${occupation === o.id ? 'on' : ''}`}>
              {o.label}
            </span>
          ))}
        </div>
      </div>

      <div className="footer-bar">
        <button className="btn-ghost" onClick={() => navigate(-1)}>Back</button>
        <button className="btn-primary full" disabled={!occupation} onClick={next}>Next</button>
      </div>
    </div>
  )
}
