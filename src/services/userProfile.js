import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export function userDocRef(uid) {
  return doc(db, 'users', uid)
}

export async function fetchUserProfile(uid) {
  if (!db) return null
  const snap = await getDoc(userDocRef(uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function ensureUserProfile(user) {
  if (!user || !db) return null
  const ref = userDocRef(user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      currency: 'PKR',
      theme: 'light',
      customCategories: [],
      createdAt: serverTimestamp(),
    })
    const again = await getDoc(ref)
    return { id: user.uid, ...again.data() }
  }
  return { id: snap.id, ...snap.data() }
}

export async function updateUserProfile(uid, patch) {
  if (!db) return
  const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined))
  await updateDoc(userDocRef(uid), {
    ...clean,
    updatedAt: serverTimestamp(),
  })
}
