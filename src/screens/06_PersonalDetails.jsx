import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator.jsx'
import { useProfile, computeAge } from '../context/ProfileContext.jsx'

export default function PersonalDetails() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const [form, setForm] = useState({
    fullName: profile.fullName,
    dob: profile.dob,
    gender: profile.gender,
    maritalStatus: profile.maritalStatus,
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const next = () => {
    updateProfile({ ...form, age: computeAge(form.dob) })
    navigate('/profile/education')
  }

  return (
    <div className="screen pad has-footer">
      <StepIndicator current={1} />
      <h2 className="screen-title">Personal Details</h2>

      <label className="field-label">Full Name</label>
      <input
        className="text-field"
        placeholder="Enter your full name"
        value={form.fullName}
        onChange={(e) => set('fullName', e.target.value)}
      />

      <label className="field-label">Date of Birth</label>
      <input
        className="text-field"
        type="date"
        value={form.dob}
        onChange={(e) => set('dob', e.target.value)}
      />

      <label className="field-label">Gender</label>
      <div className="radio-row">
        {['Male', 'Female', 'Other'].map((g) => (
          <button
            key={g}
            className={`radio-pill ${form.gender === g ? 'selected' : ''}`}
            onClick={() => set('gender', g)}
          >
            {g}
          </button>
        ))}
      </div>

      <label className="field-label">Marital Status</label>
      <select
        className="text-field"
        value={form.maritalStatus}
        onChange={(e) => set('maritalStatus', e.target.value)}
      >
        <option value="">Select marital status</option>
        {['Single', 'Married', 'Widow', 'Divorced'].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <div className="footer-bar">
        <button className="btn-primary full" onClick={next}>Next</button>
      </div>
    </div>
  )
}
