import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ROUTES } from '../constants/routes'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './Button'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: ROUTES.home, label: 'Home' },
  { to: '#features', label: 'Features' },
  { to: '#faq', label: 'FAQ' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-800/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6" aria-label="Main">
        <Link to={ROUTES.home} className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white text-sm font-extrabold">
            EX
          </span>
          Expense X
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.to.startsWith('#') ? (
              <a
                key={l.to}
                href={l.to}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:text-slate-300'}`
                }
              >
                {l.label}
              </NavLink>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          {user ? (
            <Link to={ROUTES.dashboard}>
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.login} className="hidden sm:inline">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to={ROUTES.register}>
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">Open menu</span>
            ☰
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.to.startsWith('#') ? l.to : l.to}
                  className="py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-2 flex items-center gap-3">
                <ThemeToggle />
                {!user && (
                  <Link to={ROUTES.login} onClick={() => setOpen(false)}>
                    <Button variant="secondary" size="sm">
                      Log in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
