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

const COL = 'goals'

export async function listGoals(userId) {
  if (!db) return []
  const q = query(collection(db, COL), where('userId', '==', userId))
  const snap = await getDocs(q)
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}

export function subscribeGoals(userId, onData) {
  if (!db) return () => {}
  const q = query(collection(db, COL), where('userId', '==', userId))
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    onData(rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
  })
}

export async function addGoal(userId, data) {
  if (!db) throw new Error('Firestore not available')
  return addDoc(collection(db, COL), {
    userId,
    title: data.title,
    targetAmount: Number(data.targetAmount),
    savedAmount: Number(data.savedAmount) || 0,
    deadline: data.deadline,
    createdAt: serverTimestamp(),
  })
}

export async function updateGoal(id, patch) {
  if (!db) throw new Error('Firestore not available')
  const payload = {
    ...patch,
    targetAmount: patch.targetAmount != null ? Number(patch.targetAmount) : undefined,
    savedAmount: patch.savedAmount != null ? Number(patch.savedAmount) : undefined,
    updatedAt: serverTimestamp(),
  }
  const clean = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined))
  await updateDoc(doc(db, COL, id), clean)
}

export async function removeGoal(id) {
  await deleteDoc(doc(db, COL, id))
}
