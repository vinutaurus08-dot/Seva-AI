import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OtpVerify() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(25)
  const refs = useRef([])

  useEffect(() => {
    if (timer <= 0) return
    const t = setTimeout(() => setTimer((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = d
    setOtp(next)
    if (d && i < 5) refs.current[i + 1]?.focus()
  }

  const filled = otp.every((d) => d !== '')

  return (
    <div className="screen pad">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <h2 className="screen-title">Enter OTP</h2>
      <p className="screen-sub">We have sent 6 digit code to +91 98765 43210</p>

      <div className="otp-boxes">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            className="otp-box"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
            }}
          />
        ))}
      </div>

      <p className="hint-text center">
        {timer > 0 ? (
          <>Resend OTP in 00:{String(timer).padStart(2, '0')}</>
        ) : (
          <button className="link-btn" onClick={() => setTimer(25)}>Resend OTP</button>
        )}
      </p>

      <button
        className="btn-primary btn-bottom"
        disabled={!filled}
        onClick={() => navigate('/profile-steps')}
      >
        Verify & Continue
      </button>
      <p className="hint-text center">Tip: enter any 6 digits in this demo</p>
    </div>
  )
}
