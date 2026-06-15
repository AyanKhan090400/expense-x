import { ExpenseDataProvider } from '../context/ExpenseDataContext'
import { AppLayout } from './AppLayout'
import { TipsChatbot } from '../components/TipsChatbot'

export function AppShell() {
  return (
    <ExpenseDataProvider>
      <AppLayout />
      <TipsChatbot />
    </ExpenseDataProvider>
  )
}
