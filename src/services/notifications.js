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

const COL = 'notifications'

export async function listNotifications(userId) {
  if (!db) return []
  const q = query(collection(db, COL), where('userId', '==', userId))
  const snap = await getDocs(q)
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
}

export function subscribeNotifications(userId, onData) {
  if (!db) return () => {}
  const q = query(collection(db, COL), where('userId', '==', userId))
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    onData(rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
  })
}

export async function addNotification(userId, payload) {
  if (!db) throw new Error('Firestore not available')
  return addDoc(collection(db, COL), {
    userId,
    type: payload.type || 'info',
    title: payload.title,
    message: payload.message,
    read: false,
    createdAt: serverTimestamp(),
  })
}

export async function markNotificationRead(id) {
  if (!db) return
  await updateDoc(doc(db, COL, id), { read: true })
}

export async function markAllRead(items) {
  if (!db) return
  await Promise.all(
    items.filter((n) => !n.read).map((n) => updateDoc(doc(db, COL, n.id), { read: true })),
  )
}

export async function clearNotification(id) {
  if (!db) return
  await deleteDoc(doc(db, COL, id))
}
