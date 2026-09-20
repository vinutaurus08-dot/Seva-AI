import { useNavigate } from 'react-router-dom'

const STEPS = [
  { n: 1, label: 'Personal Details', desc: 'Your basic information' },
  { n: 2, label: 'Education Details', desc: 'Your qualifications' },
  { n: 3, label: 'Occupation Details', desc: 'Your citizen category' },
  { n: 4, label: 'Additional Details', desc: 'Income, category & location' },
]

export default function ProfileSteps() {
  const navigate = useNavigate()
  return (
    <div className="screen pad">
      <h2 className="screen-title">Create Your Profile</h2>
      <p className="screen-sub">Help us to know you better</p>

      <div className="steps-overview">
        {STEPS.map((s) => (
          <div className="overview-step" key={s.n}>
            <div className="overview-num">{s.n}</div>
            <div>
              <div className="overview-label">{s.label}</div>
              <div className="overview-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary btn-bottom" onClick={() => navigate('/profile/personal')}>
        Next
      </button>
      <p className="hint-text center">You can edit later in profile</p>
    </div>
  )
}
