import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase/config'
import { ensureUserProfile, fetchUserProfile } from '../services/userProfile'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    !isFirebaseConfigured || !auth ? null : undefined,
  )
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return undefined
    }
    return onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null)
      if (u) {
        setProfileLoading(true)
        try {
          await ensureUserProfile(u)
          const p = await fetchUserProfile(u.uid)
          setProfile(p)
        } finally {
          setProfileLoading(false)
        }
      } else {
        setProfile(null)
      }
    })
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    setProfileLoading(true)
    try {
      const p = await fetchUserProfile(user.uid)
      setProfile(p)
    } finally {
      setProfileLoading(false)
    }
  }, [user])

  const value = useMemo(
    () => ({
      user,
      profile,
      profileLoading,
      refreshProfile,
      loading: user === undefined,
      isConfigured: isFirebaseConfigured,
    }),
    [user, profile, profileLoading, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
