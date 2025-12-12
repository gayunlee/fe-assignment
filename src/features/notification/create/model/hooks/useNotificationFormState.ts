import { useState, useCallback, useMemo } from 'react'
import type { NotificationTarget } from '@/entities/notification'
import type { NotificationFormState } from '../types'
import { initialNotificationFormState } from '../types'

export interface NotificationFormInitialValues {
  title?: string
  scheduledDate?: Date
  targetType?: NotificationTarget
}

export function useNotificationFormState(initialValues?: NotificationFormInitialValues) {
  const [state, setState] = useState<NotificationFormState>(() => ({
    ...initialNotificationFormState,
    ...initialValues,
  }))

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      title,
      errors: { ...prev.errors, title: undefined },
    }))
  }, [])

  const setScheduledDate = useCallback((date: Date | undefined) => {
    setState((prev) => ({
      ...prev,
      scheduledDate: date,
      errors: { ...prev.errors, scheduledAt: undefined },
    }))
  }, [])

  const setTargetType = useCallback((targetType: NotificationTarget) => {
    setState((prev) => ({
      ...prev,
      targetType,
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const errors: NotificationFormState['errors'] = {}

    if (!state.title) {
      errors.title = '제목을 입력해주세요'
    }

    if (!state.scheduledDate) {
      errors.scheduledAt = '발송 시간을 선택해주세요'
    }

    setState((prev) => ({ ...prev, errors }))

    return Object.keys(errors).length === 0
  }, [state])

  const reset = useCallback(() => {
    setState(initialNotificationFormState)
  }, [])

  const scheduledAt = useMemo(() => {
    if (!state.scheduledDate) {
      return null
    }
    return state.scheduledDate.toISOString()
  }, [state.scheduledDate])

  const isValid = useMemo(() => {
    if (!state.title) {
      return false
    }

    if (!state.scheduledDate) {
      return false
    }

    return true
  }, [state.title, state.scheduledDate])

  const hasChanges = useMemo(() => {
    const initial = initialValues ?? initialNotificationFormState
    return (
      state.title !== (initial.title ?? '') ||
      state.scheduledDate !== initial.scheduledDate ||
      state.targetType !== (initial.targetType ?? 'all')
    )
  }, [state, initialValues])

  return {
    state,
    scheduledAt,
    isValid,
    hasChanges,
    actions: {
      setTitle,
      setScheduledDate,
      setTargetType,
      validate,
      reset,
    },
  }
}
