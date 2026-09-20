// Renders the 1-2-3-4 progress dots used across the profile creation steps.
export default function StepIndicator({ current, total = 4 }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1
        const state = n < current ? 'done' : n === current ? 'active' : 'todo'
        return (
          <div className="step-dot-wrap" key={n}>
            <div className={`step-dot ${state}`}>{state === 'done' ? '✓' : n}</div>
            {n < total && <div className={`step-line ${n < current ? 'done' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}
