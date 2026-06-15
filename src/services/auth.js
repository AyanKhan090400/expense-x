import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'
import { ensureUserProfile } from './userProfile'

export function getFirebaseErrorMessage(err) {
  const code = err?.code || ''
  const map = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/user-not-found': 'No account found for this email.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || err?.message || 'Something went wrong.'
}

export async function registerWithEmail(email, password, displayName) {
  if (!auth) throw new Error('Firebase is not configured.')
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(cred.user, { displayName })
  }
  await ensureUserProfile(cred.user)
  return cred.user
}

export async function loginWithEmail(email, password) {
  if (!auth) throw new Error('Firebase is not configured.')
  const cred = await signInWithEmailAndPassword(auth, email, password)
  await ensureUserProfile(cred.user)
  return cred.user
}

export async function loginWithGoogle() {
  if (!auth || !googleProvider) throw new Error('Firebase is not configured.')
  const cred = await signInWithPopup(auth, googleProvider)
  await ensureUserProfile(cred.user)
  return cred.user
}

export async function logoutUser() {
  if (!auth) return
  await signOut(auth)
}

export async function resetPassword(email) {
  if (!auth) throw new Error('Firebase is not configured.')
  await sendPasswordResetEmail(auth, email)
}

export { isFirebaseConfigured }
