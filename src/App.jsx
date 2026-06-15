import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { ROUTES } from './constants/routes'
import { PublicLayout } from './layouts/PublicLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { AppShell } from './layouts/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Analytics } from './pages/Analytics'
import { Budgets } from './pages/Budgets'
import { Goals } from './pages/Goals'
import { Reports } from './pages/Reports'
import { Profile } from './pages/Profile'
import { Notifications } from './pages/Notifications'

function ThemedApp() {
  const { profile } = useAuth()

  return (
    <ThemeProvider profileTheme={profile?.theme}>
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.home} element={<Home />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path={ROUTES.login} element={<Login />} />
              <Route path={ROUTES.register} element={<Register />} />
              <Route path={ROUTES.forgot} element={<ForgotPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path={ROUTES.dashboard} element={<Dashboard />} />
                <Route path={ROUTES.transactions} element={<Transactions />} />
                <Route path={ROUTES.analytics} element={<Analytics />} />
                <Route path={ROUTES.budgets} element={<Budgets />} />
                <Route path={ROUTES.goals} element={<Goals />} />
                <Route path={ROUTES.reports} element={<Reports />} />
                <Route path={ROUTES.profile} element={<Profile />} />
                <Route path={ROUTES.notifications} element={<Notifications />} />
              </Route>
            </Route>

            <Route path="/app" element={<Navigate to={ROUTES.dashboard} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white',
            }}
          />
        </BrowserRouter>
      </CurrencyProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </HelmetProvider>
  )
}
