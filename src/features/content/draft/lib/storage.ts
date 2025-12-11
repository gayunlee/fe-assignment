import { STORAGE_KEYS } from '@/shared/config/constants'
import type { ContentDraft } from '../model/types'

export function saveDraft(draft: ContentDraft): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTENT_DRAFT, JSON.stringify(draft))
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

export function loadDraft(): ContentDraft | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONTENT_DRAFT)
    if (!stored) {
      return null
    }
    return JSON.parse(stored) as ContentDraft
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

export function deleteDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONTENT_DRAFT)
  } catch (error) {
    console.error('Failed to delete draft:', error)
  }
}

export function hasDraft(): boolean {
  return localStorage.getItem(STORAGE_KEYS.CONTENT_DRAFT) !== null
}
