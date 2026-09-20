import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { getRecommendations } from '../lib/recommend.js'

const ProfileContext = createContext(null)
const STORAGE_KEY = 'sevaai_profile'
const LANG_KEY = 'sevaai_language'

const EMPTY_PROFILE = {
  fullName: '',
  dob: '',
  age: null,
  gender: '',
  maritalStatus: '',
  education: '',
  course: '',
  university: '',
  yearOfPassing: '',
  occupation: '',
  subOccupation: '',
  income: null,
  category: '',
  state: '',
  district: '',
  disability: false,
  landHolding: 0,
}

function loadStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE
  } catch {
    return EMPTY_PROFILE
  }
}

export function ProfileProvider({ children }) {
  // Restore from localStorage so a page refresh keeps the user logged in.
  const [profile, setProfile] = useState(loadStoredProfile)
  const [language, setLanguage] = useState(() => localStorage.getItem(LANG_KEY) || 'en')

  // Persist profile + language whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch { /* ignore quota / private-mode errors */ }
  }, [profile])

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language)
  }, [language])

  // Merge partial updates from each profile step.
  const updateProfile = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  // Replace the whole profile (used by demo accounts).
  const loadProfile = useCallback((next) => {
    setProfile({ ...EMPTY_PROFILE, ...next })
  }, [])

  const resetProfile = useCallback(() => setProfile(EMPTY_PROFILE), [])

  // Clear the session entirely (logout).
  const logout = useCallback(() => {
    setProfile(EMPTY_PROFILE)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch { /* ignore */ }
  }, [])

  // A profile is considered "logged in" once an occupation is chosen
  // (set by the demo accounts and by step 3 of manual onboarding).
  const isLoggedIn = !!profile.occupation

  // Recompute recommendations whenever the profile changes.
  const recommendations = useMemo(() => {
    if (!profile.occupation) return []
    return getRecommendations(profile)
  }, [profile])

  const value = {
    profile,
    updateProfile,
    loadProfile,
    resetProfile,
    logout,
    isLoggedIn,
    recommendations,
    language,
    setLanguage,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}

export function computeAge(dob) {
  if (!dob) return null
  const d = new Date(dob)
  if (isNaN(d)) return null
  const diff = Date.now() - d.getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}
