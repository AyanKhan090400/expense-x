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
      Firebase is not configured. Copy{' '}
      <code className="font-mono bg-amber-400/40 px-1 rounded">.env.example</code> to{' '}
      <code className="font-mono bg-amber-400/40 px-1 rounded">.env</code> and add your keys.
      For deploy, set the same <code className="font-mono bg-amber-400/40 px-1 rounded">VITE_*</code>{' '}
      variables in your hosting dashboard.{' '}
      <Link to="/" className="underline font-semibold">
        Home
      </Link>
    </div>
  )
}
