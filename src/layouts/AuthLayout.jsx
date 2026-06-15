import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { ThemeToggle } from '../components/ThemeToggle'
import { ConfigBanner } from '../components/ConfigBanner'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <ConfigBanner />
      <div className="flex justify-between items-center px-4 py-4 max-w-6xl mx-auto w-full">
        <Link to={ROUTES.home} className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white text-sm font-extrabold">
            EX
          </span>
          Expense X
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-4 pb-16">
        <Outlet />
      </div>
    </div>
  )
}
