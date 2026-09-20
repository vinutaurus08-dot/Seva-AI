import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { EDUCATION_LEVELS } from '../data/occupations.js'

export default function EducationDetails() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const [form, setForm] = useState({
    education: profile.education,
    course: profile.course,
    university: profile.university,
    yearOfPassing: profile.yearOfPassing,
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const next = () => {
    updateProfile(form)
    navigate('/profile/occupation')
  }

  const years = []
  for (let y = 2030; y >= 2000; y--) years.push(String(y))

  return (
    <div className="screen pad has-footer">
      <StepIndicator current={2} />
      <h2 className="screen-title">Education Details</h2>

      <label className="field-label">Highest Education</label>
      <select
        className="text-field"
        value={form.education}
        onChange={(e) => set('education', e.target.value)}
      >
        <option value="">Select highest education</option>
        {EDUCATION_LEVELS.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <label className="field-label">Course / Stream</label>
      <input
        className="text-field"
        placeholder="e.g. B.Com, Science, Arts"
        value={form.course}
        onChange={(e) => set('course', e.target.value)}
      />

      <label className="field-label">University / College</label>
      <input
        className="text-field"
        placeholder="Enter university / college name"
        value={form.university}
        onChange={(e) => set('university', e.target.value)}
      />

      <label className="field-label">Year of Passing / Pursuing</label>
      <select
        className="text-field"
        value={form.yearOfPassing}
        onChange={(e) => set('yearOfPassing', e.target.value)}
      >
        <option value="">Select year</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <div className="footer-bar">
        <button className="btn-ghost" onClick={() => navigate(-1)}>Back</button>
        <button className="btn-primary full" onClick={next}>Next</button>
      </div>
    </div>
  )
}
