import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ROUTES } from '../constants/routes'
import { useExpenseData } from '../context/ExpenseDataContext'
import { SEO } from '../components/SEO'
import { Button } from '../components/Button'
import { markNotificationRead, markAllRead, clearNotification } from '../services/notifications'
import { EmptyState } from '../components/EmptyState'

export function Notifications() {
  const { notifications, refreshNotifications } = useExpenseData()

  const onRead = async (n) => {
    try {
      await markNotificationRead(n.id)
      await refreshNotifications()
    } catch (e) {
      toast.error(e?.message || 'Could not update')
    }
  }

  const onReadAll = async () => {
    try {
      await markAllRead(notifications)
      await refreshNotifications()
      toast.success('All marked read')
    } catch (e) {
      toast.error(e?.message || 'Error')
    }
  }

  const onDelete = async (n) => {
    try {
      await clearNotification(n.id)
      await refreshNotifications()
    } catch (e) {
      toast.error(e?.message || 'Error')
    }
  }

  return (
    <>
      <SEO title="Notifications" path={ROUTES.notifications} />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Budget alerts, bill reminders, and goal check-ins.</p>
          </div>
          {notifications.some((n) => !n.read) && (
            <Button variant="secondary" size="sm" onClick={onReadAll}>
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            title="You are all caught up"
            description="We will surface alerts here when budgets tighten or goals need attention."
          />
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  n.read
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-brand-200 dark:border-brand-900 bg-brand-50/50 dark:bg-brand-950/20'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {n.createdAt?.seconds
                      ? format(new Date(n.createdAt.seconds * 1000), 'PPpp')
                      : 'Just now'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!n.read && (
                    <Button size="sm" variant="secondary" onClick={() => onRead(n)}>
                      Mark read
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => onDelete(n)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
