import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COL = 'transactions'

const MAX_TX = 500

export function transactionsQuery(userId) {
  return query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(MAX_TX),
  )
}

export function subscribeTransactions(userId, onData, onError) {
  if (!db) return () => {}
  const q = transactionsQuery(userId)
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    },
    onError,
  )
}

export async function addTransaction(userId, data) {
  if (!db) throw new Error('Firestore not available')
  return addDoc(collection(db, COL), {
    userId,
    title: data.title,
    amount: Number(data.amount),
    type: data.type,
    category: data.category,
    date: data.date,
    paymentMethod: data.paymentMethod || 'Card',
    notes: data.notes || '',
    receiptUrl: data.receiptUrl || '',
    tags: data.tags || [],
    recurring: Boolean(data.recurring),
    recurringRule: data.recurringRule || '',
    billDueDate: data.billDueDate || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateTransaction(transactionId, data) {
  if (!db) throw new Error('Firestore not available')
  const ref = doc(db, COL, transactionId)
  const payload = {
    ...data,
    amount: data.amount != null ? Number(data.amount) : undefined,
    updatedAt: serverTimestamp(),
  }
  const clean = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  )
  await updateDoc(ref, clean)
}

export async function removeTransaction(transactionId) {
  if (!db) throw new Error('Firestore not available')
  await deleteDoc(doc(db, COL, transactionId))
}

export async function listAllTransactions(userId, max = 5000) {
  if (!db) return []
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(max),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
