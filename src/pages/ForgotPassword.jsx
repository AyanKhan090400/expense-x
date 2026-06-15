import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROUTES } from '../constants/routes'
import { resetPassword, getFirebaseErrorMessage } from '../services/auth'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { SEO } from '../components/SEO'

export function ForgotPassword() {
  const { isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isConfigured) return <Navigate to={ROUTES.home} replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('Check your inbox for reset instructions.')
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Reset password" description="Reset your Expense X password." path={ROUTES.forgot} />
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl p-8 backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Enter your email and we will send a reset link.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset email'}
          </Button>
        </form>

        {sent && (
          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400" role="status">
            If an account exists for this email, you will receive a message shortly.
          </p>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to={ROUTES.login} className="font-semibold text-brand-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </>
  )
}
