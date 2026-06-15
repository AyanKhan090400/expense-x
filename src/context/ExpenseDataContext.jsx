import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { db } from '../firebase/config'
import * as budgetsApi from '../services/budgets'
import * as goalsApi from '../services/goals'
import * as notificationsApi from '../services/notifications'
import * as txApi from '../services/transactions'
import { addNotification } from '../services/notifications'
import { useAuth } from './AuthContext'

const ExpenseDataContext = createContext(null)

export function ExpenseDataProvider({ children }) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !db) {
      setTransactions([])
      setBudgets([])
      setGoals([])
      setNotifications([])
      setLoading(false)
      return undefined
    }

    setLoading(true)
    const offTx = txApi.subscribeTransactions(
      user.uid,
      (rows) => {
        setTransactions(rows)
        setLoading(false)
      },
      () => setLoading(false),
    )
    const offB = budgetsApi.subscribeBudgets(user.uid, setBudgets)
    const offG = goalsApi.subscribeGoals(user.uid, setGoals)
    const offN = notificationsApi.subscribeNotifications(user.uid, setNotifications)

    return () => {
      offTx()
      offB()
      offG()
      offN()
    }
  }, [user])

  const refreshBudgets = useCallback(async () => {
    if (!user) return
    const b = await budgetsApi.listBudgets(user.uid)
    setBudgets(b)
  }, [user])

  const refreshGoals = useCallback(async () => {
    if (!user) return
    const g = await goalsApi.listGoals(user.uid)
    setGoals(g)
  }, [user])

  const refreshNotifications = useCallback(async () => {
    if (!user) return
    const n = await notificationsApi.listNotifications(user.uid)
    setNotifications(n)
  }, [user])

  const addTx = useCallback(
    async (data) => {
      if (!user) return
      await txApi.addTransaction(user.uid, data)
    },
    [user],
  )

  const updateTx = useCallback(async (id, data) => {
    await txApi.updateTransaction(id, data)
  }, [])

  const deleteTx = useCallback(async (id) => {
    await txApi.removeTransaction(id)
  }, [])

  const addBudget = useCallback(
    async (data) => {
      if (!user) return
      await budgetsApi.addBudget(user.uid, data)
    },
    [user],
  )

  const updateBudget = useCallback(async (id, patch) => {
    await budgetsApi.updateBudget(id, patch)
  }, [])

  const deleteBudget = useCallback(async (id) => {
    await budgetsApi.removeBudget(id)
  }, [])

  const addGoalFn = useCallback(
    async (data) => {
      if (!user) return
      await goalsApi.addGoal(user.uid, data)
    },
    [user],
  )

  const updateGoalFn = useCallback(async (id, patch) => {
    await goalsApi.updateGoal(id, patch)
  }, [])

  const deleteGoalFn = useCallback(async (id) => {
    await goalsApi.removeGoal(id)
  }, [])

  const pushNotification = useCallback(
    async (payload) => {
      if (!user) return
      await addNotification(user.uid, payload)
      await refreshNotifications()
    },
    [user, refreshNotifications],
  )

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      goals,
      notifications,
      loading,
      addTx,
      updateTx,
      deleteTx,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal: addGoalFn,
      updateGoal: updateGoalFn,
      deleteGoal: deleteGoalFn,
      refreshBudgets,
      refreshGoals,
      refreshNotifications,
      pushNotification,
    }),
    [
      transactions,
      budgets,
      goals,
      notifications,
      loading,
      addTx,
      updateTx,
      deleteTx,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoalFn,
      updateGoalFn,
      deleteGoalFn,
      refreshBudgets,
      refreshGoals,
      refreshNotifications,
      pushNotification,
    ],
  )

  return <ExpenseDataContext.Provider value={value}>{children}</ExpenseDataContext.Provider>
}

export function useExpenseData() {
  const ctx = useContext(ExpenseDataContext)
  if (!ctx) throw new Error('useExpenseData must be used within ExpenseDataProvider')
  return ctx
}
