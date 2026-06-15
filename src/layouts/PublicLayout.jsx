import { Outlet } from 'react-router-dom'
import { PublicNavbar } from '../components/PublicNavbar'
import { LandingFooter } from '../components/LandingFooter'
import { ConfigBanner } from '../components/ConfigBanner'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <ConfigBanner />
      <PublicNavbar />
      <Outlet />
      <LandingFooter />
    </div>
  )
}
