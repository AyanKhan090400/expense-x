import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ConfigBanner() {
  const { isConfigured } = useAuth()
  if (isConfigured) return null

  return (
    <div
      role="alert"
      className="bg-amber-500 text-amber-950 text-center text-sm font-medium px-4 py-2"
    >
      Firebase is not configured. For local dev, copy{' '}
      <code className="font-mono bg-amber-400/40 px-1 rounded">.env.example</code> to{' '}
      <code className="font-mono bg-amber-400/40 px-1 rounded">.env</code>. Production builds
      use <code className="font-mono bg-amber-400/40 px-1 rounded">.env.production</code> from the
      repo.{' '}
      <Link to="/" className="underline font-semibold">
        Home
      </Link>
    </div>
  )
}
