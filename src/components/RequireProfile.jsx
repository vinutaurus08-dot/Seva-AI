import { Navigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext.jsx'

// Guards screens that only make sense once a profile exists.
// Without one, send the user back to login instead of an empty "Guest" view.
export default function RequireProfile({ children }) {
  const { isLoggedIn } = useProfile()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}
