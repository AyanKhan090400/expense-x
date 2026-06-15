import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COL = 'budgets'

export async function listBudgets(userId) {
  if (!db) return []
  const q = query(collection(db, COL), where('userId', '==', userId))
  const snap = await getDocs(q)
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}

export function subscribeBudgets(userId, onData) {
  if (!db) return () => {}
  const q = query(collection(db, COL), where('userId', '==', userId))
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    onData(rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
  })
}

export async function addBudget(userId, data) {
  if (!db) throw new Error('Firestore not available')
  return addDoc(collection(db, COL), {
    userId,
    name: data.name,
    category: data.category,
    limit: Number(data.limit),
    period: data.period || 'monthly',
    warnPercent: Number(data.warnPercent) || 80,
    createdAt: serverTimestamp(),
  })
}

export async function updateBudget(id, patch) {
  if (!db) throw new Error('Firestore not available')
  const payload = {
    ...patch,
    limit: patch.limit != null ? Number(patch.limit) : undefined,
    warnPercent: patch.warnPercent != null ? Number(patch.warnPercent) : undefined,
    updatedAt: serverTimestamp(),
  }
  const clean = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined))
  await updateDoc(doc(db, COL, id), clean)
}

export async function removeBudget(id) {
  await deleteDoc(doc(db, COL, id))
}
