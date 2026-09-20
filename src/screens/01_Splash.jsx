import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext.jsx'

export default function Splash() {
  const navigate = useNavigate()
  const { isLoggedIn } = useProfile()

  useEffect(() => {
    // A returning (persisted) user skips onboarding and lands on the dashboard.
    const dest = isLoggedIn ? '/dashboard' : '/language'
    const t = setTimeout(() => navigate(dest), 2200)
    return () => clearTimeout(t)
  }, [navigate, isLoggedIn])

  return (
    <div className="splash" onClick={() => navigate(isLoggedIn ? '/dashboard' : '/language')}>
      <div className="splash-logo">💜</div>
      <h1 className="splash-title">SevaAI</h1>
      <p className="splash-sub">AI Citizen Welfare Assistant</p>
      <p className="splash-tagline">
        Smart access to welfare schemes and benefits for every citizen.
      </p>
      <div className="splash-loader" />
    </div>
  )
}
