import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../firebase/config'

export async function uploadReceipt(userId, file) {
  if (!storage || !file) return ''
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const pathRef = ref(storage, `receipts/${userId}/${safeName}`)
  await uploadBytes(pathRef, file, { contentType: file.type })
  return getDownloadURL(pathRef)
}
