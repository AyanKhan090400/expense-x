import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white text-sm">EX</span>
            Expense X
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Personal finance clarity — budgets, goals, and beautiful analytics.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a href="#features" className="hover:text-brand-600">
                Features
              </a>
            </li>
            <li>
              <Link to={ROUTES.register} className="hover:text-brand-600">
                Sign up
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link to={ROUTES.login} className="hover:text-brand-600">
                Log in
              </Link>
            </li>
            <li>
              <Link to={ROUTES.dashboard} className="hover:text-brand-600">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Legal</h4>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Demo application. Configure Firebase environment variables before production use.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Expense X. All rights reserved.
      </div>
    </footer>
  )
}
