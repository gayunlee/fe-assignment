import { useEffect, useRef, useCallback } from 'react'
import { AUTO_SAVE_INTERVAL } from '@/shared/config/constants'
import type { ContentFormData } from '../types'

interface UseAutoSaveOptions {
  data: Partial<ContentFormData>
  onSave: (data: Partial<ContentFormData>) => void
  enabled?: boolean
  interval?: number
}

interface UseAutoSaveReturn {
  lastSavedAt: Date | null
  saveNow: () => void
}

export function useAutoSave(options: UseAutoSaveOptions): UseAutoSaveReturn {
  const { data, onSave, enabled = true, interval = AUTO_SAVE_INTERVAL } = options
  const lastSavedAtRef = useRef<Date | null>(null)
  const previousDataRef = useRef<Partial<ContentFormData>>({})

  const hasDataChanged = useCallback(() => {
    return JSON.stringify(data) !== JSON.stringify(previousDataRef.current)
  }, [data])

  const saveNow = useCallback(() => {
    if (hasDataChanged()) {
      onSave(data)
      lastSavedAtRef.current = new Date()
      previousDataRef.current = { ...data }
    }
  }, [data, hasDataChanged, onSave])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const intervalId = setInterval(() => {
      if (hasDataChanged()) {
        onSave(data)
        lastSavedAtRef.current = new Date()
        previousDataRef.current = { ...data }
      }
    }, interval)

    return () => {
      clearInterval(intervalId)
    }
  }, [data, enabled, interval, onSave, hasDataChanged])

  return {
    lastSavedAt: lastSavedAtRef.current,
    saveNow,
  }
}
