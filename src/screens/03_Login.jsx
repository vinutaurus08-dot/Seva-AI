import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEMO_PROFILES } from '../data/demoProfiles.js'
import { useProfile } from '../context/ProfileContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { loadProfile } = useProfile()
  const [phone, setPhone] = useState('')

  const useDemo = (demo) => {
    loadProfile(demo.profile)
    navigate('/dashboard')
  }

  return (
    <div className="screen pad">
      <div className="login-hero">
        <div className="login-logo">💜</div>
        <h2 className="screen-title">Welcome to SevaAI</h2>
        <p className="screen-sub">Login to continue</p>
      </div>

      <label className="field-label">Mobile Number</label>
      <div className="phone-input">
        <span className="phone-prefix">🇮🇳 +91</span>
        <input
          className="phone-field"
          type="tel"
          inputMode="numeric"
          placeholder="Enter mobile number"
          value={phone}
          maxLength={10}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <button
        className="btn-primary"
        disabled={phone.length !== 10}
        onClick={() => navigate('/otp')}
      >
        Send OTP
      </button>
      <p className="hint-text">
        {phone.length > 0 && phone.length !== 10
          ? 'Enter a valid 10-digit mobile number'
          : "We'll send a 6 digit OTP to verify your number"}
      </p>

      <div className="divider"><span>or try a demo account</span></div>

      <div className="demo-grid">
        {DEMO_PROFILES.map((d) => (
          <button key={d.id} className="demo-chip" onClick={() => useDemo(d)}>
            <span className="demo-emoji">{d.emoji}</span>
            <span className="demo-name">{d.label}</span>
            <span className="demo-tag">{d.tag}</span>
          </button>
        ))}
      </div>

      <p className="secure-note">🔒 Your data is safe and secure</p>
    </div>
  )
}
