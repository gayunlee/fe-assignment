import { useState, useCallback, useMemo } from 'react'
import type { NotificationFormState } from '../types'
import { initialNotificationFormState } from '../types'

export function useNotificationFormState() {
  const [state, setState] = useState<NotificationFormState>(initialNotificationFormState)

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      title,
      errors: { ...prev.errors, title: undefined },
    }))
  }, [])

  const setLinkUrl = useCallback((linkUrl: string) => {
    setState((prev) => ({
      ...prev,
      linkUrl,
      errors: { ...prev.errors, linkUrl: undefined },
    }))
  }, [])

  const clearLinkUrl = useCallback(() => {
    setState((prev) => ({
      ...prev,
      linkUrl: '',
      errors: { ...prev.errors, linkUrl: undefined },
    }))
  }, [])

  const setScheduledDate = useCallback((date: Date | undefined) => {
    setState((prev) => ({
      ...prev,
      scheduledDate: date,
      errors: { ...prev.errors, scheduledAt: undefined },
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const errors: NotificationFormState['errors'] = {}

    if (!state.title) {
      errors.title = '제목을 입력해주세요'
    }

    if (!state.linkUrl) {
      errors.linkUrl = '링크를 입력해주세요'
    } else {
      try {
        new URL(state.linkUrl)
      } catch {
        errors.linkUrl = '올바른 URL 형식이 아닙니다'
      }
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
    if (!state.title || !state.linkUrl) {
      return false
    }

    try {
      new URL(state.linkUrl)
    } catch {
      return false
    }

    if (!state.scheduledDate) {
      return false
    }

    return true
  }, [state.title, state.linkUrl, state.scheduledDate])

  const hasChanges = useMemo(() => {
    return state.title !== '' || state.linkUrl !== '' || state.scheduledDate !== undefined
  }, [state])

  return {
    state,
    scheduledAt,
    isValid,
    hasChanges,
    actions: {
      setTitle,
      setLinkUrl,
      clearLinkUrl,
      setScheduledDate,
      validate,
      reset,
    },
  }
}
