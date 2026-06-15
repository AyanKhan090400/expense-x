import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ROUTES } from '../constants/routes'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'
import { useExpenseData } from '../context/ExpenseDataContext'
import clsx from 'clsx'

const nav = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: '📊' },
  { to: ROUTES.transactions, label: 'Transactions', icon: '💳' },
  { to: ROUTES.analytics, label: 'Analytics', icon: '📈' },
  { to: ROUTES.budgets, label: 'Budgets', icon: '🎯' },
  { to: ROUTES.goals, label: 'Goals', icon: '🏆' },
  { to: ROUTES.reports, label: 'Reports', icon: '📄' },
  { to: ROUTES.notifications, label: 'Notifications', icon: '🔔' },
  { to: ROUTES.profile, label: 'Profile', icon: '👤' },
]

export function AppLayout() {
  const { user } = useAuth()
  const { notifications } = useExpenseData()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transform transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="App navigation"
      >
        <div className="flex h-16 items-center gap-2 px-5 border-b border-slate-100 dark:border-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white text-sm font-bold">
            E X
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Expense X</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80',
                )
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
              {item.to === ROUTES.notifications && unread > 0 && (
                <span className="ml-auto text-xs font-bold bg-red-500 text-white rounded-full px-2 py-0.5">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 lg:px-8">
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <div className="hidden lg:block text-sm text-slate-600 dark:text-slate-200">
            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to={ROUTES.notifications}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
              aria-label="Notifications"
            >
              🔔
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
