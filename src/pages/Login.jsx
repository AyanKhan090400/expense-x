import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROUTES } from '../constants/routes'
import { loginWithEmail, loginWithGoogle, getFirebaseErrorMessage } from '../services/auth'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { SEO } from '../components/SEO'

export function Login() {
  const { user, isConfigured } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname || ROUTES.dashboard
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isConfigured) return <Navigate to={ROUTES.home} replace />
  if (user) return <Navigate to={from} replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const onGoogle = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Signed in with Google')
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Log in" description="Sign in to Expense X." path={ROUTES.login} />
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl p-8 backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          New here?{' '}
          <Link to={ROUTES.register} className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input
            type="email"
            name="email"
            label="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            name="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <Link to={ROUTES.forgot} className="text-sm font-medium text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Or</span>
          </div>
        </div>

        <Button type="button" variant="secondary" className="w-full" onClick={onGoogle} disabled={loading}>
          Continue with Google
        </Button>
      </div>
    </>
  )
}
