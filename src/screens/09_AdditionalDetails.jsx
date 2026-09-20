import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/StepIndicator.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { CATEGORIES, STATES, INCOME_RANGES } from '../data/occupations.js'

export default function AdditionalDetails() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const [form, setForm] = useState({
    income: profile.income ?? '',
    category: profile.category,
    state: profile.state,
    district: profile.district,
    disability: profile.disability,
    landHolding: profile.landHolding ?? 0,
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const isFarmer = profile.occupation === 'farmer'

  const save = () => {
    updateProfile({
      income: Number(form.income) || 0,
      category: form.category,
      state: form.state,
      district: form.district,
      disability: form.disability,
      landHolding: Number(form.landHolding) || 0,
    })
    navigate('/dashboard')
  }

  return (
    <div className="screen pad has-footer">
      <StepIndicator current={4} />
      <h2 className="screen-title">Additional Details</h2>

      <label className="field-label">Annual Income</label>
      <select
        className="text-field"
        value={form.income}
        onChange={(e) => set('income', e.target.value)}
      >
        <option value="">Select income range</option>
        {INCOME_RANGES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>

      <label className="field-label">Category (SC/ST/OBC/General/Minority)</label>
      <select
        className="text-field"
        value={form.category}
        onChange={(e) => set('category', e.target.value)}
      >
        <option value="">Select category</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label className="field-label">State</label>
      <select className="text-field" value={form.state} onChange={(e) => set('state', e.target.value)}>
        <option value="">Select state</option>
        {STATES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <label className="field-label">District</label>
      <input
        className="text-field"
        placeholder="Enter your district"
        value={form.district}
        onChange={(e) => set('district', e.target.value)}
      />

      {isFarmer && (
        <>
          <label className="field-label">Land Holding (in acres)</label>
          <input
            className="text-field"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 2.5"
            value={form.landHolding}
            onChange={(e) => set('landHolding', e.target.value)}
          />
        </>
      )}

      <label className="field-label">Do you have a Disability?</label>
      <div className="radio-row">
        <button
          className={`radio-pill ${form.disability ? 'selected' : ''}`}
          onClick={() => set('disability', true)}
        >
          Yes
        </button>
        <button
          className={`radio-pill ${!form.disability ? 'selected' : ''}`}
          onClick={() => set('disability', false)}
        >
          No
        </button>
      </div>

      <div className="footer-bar">
        <button className="btn-ghost" onClick={() => navigate(-1)}>Back</button>
        <button className="btn-primary full" onClick={save}>Save & Continue</button>
      </div>
    </div>
  )
}
