import { useMemo } from 'react'
import { DEFAULT_CATEGORIES } from '../constants/categories'
import { STORAGE_KEYS } from '../constants/storageKeys'

function readLocalCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.customCategories)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useCategories(profile) {
  return useMemo(() => {
    const fromProfile = profile?.customCategories
    const custom = Array.isArray(fromProfile) && fromProfile.length ? fromProfile : readLocalCustom()
    const set = new Set([...DEFAULT_CATEGORIES, ...custom])
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [profile?.customCategories])
}
