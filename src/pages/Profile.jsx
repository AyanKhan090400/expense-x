import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { updateProfile } from 'firebase/auth'
import { ROUTES } from '../constants/routes'
import { auth } from '../firebase/config'
import { DEFAULT_CURRENCY } from '../constants/currencies'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { updateUserProfile } from '../services/userProfile'
import { logoutUser } from '../services/auth'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { SEO } from '../components/SEO'

export function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const { theme, setTheme } = useTheme()

  const [name, setName] = useState(profile?.displayName || user?.displayName || '')
  const [customCat, setCustomCat] = useState('')

  useEffect(() => {
    setName(profile?.displayName || user?.displayName || '')
  }, [profile?.displayName, user?.displayName])

  const persist = async (e) => {
    e.preventDefault()
    if (!user) return
    try {
      if (auth && name !== user.displayName) {
        await updateProfile(user, { displayName: name })
      }
      await updateUserProfile(user.uid, {
        displayName: name,
        currency: DEFAULT_CURRENCY,
        theme,
        customCategories: profile?.customCategories || [],
      })
      await refreshProfile()
      toast.success('Profile saved')
    } catch (err) {
      toast.error(err?.message || 'Could not save profile')
    }
  }

  const addCategory = async () => {
    const label = customCat.trim()
    if (!label) return
    if (!user) return
    const next = Array.from(new Set([...(profile?.customCategories || []), label]))
    try {
      await updateUserProfile(user.uid, { customCategories: next })
      try {
        localStorage.setItem(STORAGE_KEYS.customCategories, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      setCustomCat('')
      await refreshProfile()
      toast.success('Custom category added')
    } catch (e) {
      toast.error(e?.message || 'Error')
    }
  }

  const onLogout = async () => {
    await logoutUser()
    toast.success('Signed out')
  }

  return (
    <>
      <SEO title="Profile" path={ROUTES.profile} />
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile & settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your identity, theme, and categories.</p>
        </div>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-2xl font-bold text-brand-700 dark:text-brand-300 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                (name || user?.email || '?').slice(0, 1).toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{user?.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Signed in with Firebase Authentication</p>
            </div>
          </div>

          <form onSubmit={persist} className="space-y-4 pt-2">
            <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Currency</label>
                <div className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100">
                  PKR — Pakistani Rupee (Rs)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">All amounts are stored in rupees.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400">Saved to your account on submit.</p>
              </div>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Custom categories</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Extend default categories with labels specific to your life.
          </p>
          {(profile?.customCategories || []).length > 0 && (
            <ul className="flex flex-wrap gap-2 text-xs">
              {profile.customCategories.map((c) => (
                <li key={c} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  {c}
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={customCat}
              onChange={(e) => setCustomCat(e.target.value)}
            />
            <Button type="button" variant="secondary" onClick={addCategory}>
              Add
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 p-6 space-y-3">
          <h2 className="font-semibold text-red-800 dark:text-red-200">Account</h2>
          <p className="text-sm text-red-900/80 dark:text-red-100/80">
            Sign out on this device. To delete your Firebase project data, use the console or add a callable function.
          </p>
          <Button variant="danger" type="button" onClick={onLogout}>
            Log out
          </Button>
        </section>
      </div>
    </>
  )
}
