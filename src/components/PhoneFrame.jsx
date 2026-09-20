// Centers the app inside a phone-style shell so it matches the mockup on
// desktop, while still filling the screen on small/mobile viewports.
export default function PhoneFrame({ children }) {
  return (
    <div className="frame-bg">
      <div className="phone">
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  )
}
