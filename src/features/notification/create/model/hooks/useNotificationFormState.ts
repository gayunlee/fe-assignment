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

  const setScheduledYear = useCallback((year: string) => {
    setState((prev) => ({
      ...prev,
      scheduledYear: year,
      errors: { ...prev.errors, scheduledAt: undefined },
    }))
  }, [])

  const setScheduledMonth = useCallback((month: string) => {
    setState((prev) => ({
      ...prev,
      scheduledMonth: month,
      errors: { ...prev.errors, scheduledAt: undefined },
    }))
  }, [])

  const setScheduledDay = useCallback((day: string) => {
    setState((prev) => ({
      ...prev,
      scheduledDay: day,
      errors: { ...prev.errors, scheduledAt: undefined },
    }))
  }, [])

  const setScheduledHour = useCallback((hour: string) => {
    setState((prev) => ({
      ...prev,
      scheduledHour: hour,
      errors: { ...prev.errors, scheduledAt: undefined },
    }))
  }, [])

  const setScheduledMinute = useCallback((minute: string) => {
    setState((prev) => ({
      ...prev,
      scheduledMinute: minute,
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

    if (
      !state.scheduledYear ||
      !state.scheduledMonth ||
      !state.scheduledDay ||
      !state.scheduledHour ||
      !state.scheduledMinute
    ) {
      errors.scheduledAt = '발송 시간을 선택해주세요'
    }

    setState((prev) => ({ ...prev, errors }))

    return Object.keys(errors).length === 0
  }, [state])

  const reset = useCallback(() => {
    setState(initialNotificationFormState)
  }, [])

  const scheduledAt = useMemo(() => {
    if (
      !state.scheduledYear ||
      !state.scheduledMonth ||
      !state.scheduledDay ||
      !state.scheduledHour ||
      !state.scheduledMinute
    ) {
      return null
    }

    return `${state.scheduledYear}-${state.scheduledMonth.padStart(2, '0')}-${state.scheduledDay.padStart(2, '0')}T${state.scheduledHour.padStart(2, '0')}:${state.scheduledMinute.padStart(2, '0')}:00`
  }, [
    state.scheduledYear,
    state.scheduledMonth,
    state.scheduledDay,
    state.scheduledHour,
    state.scheduledMinute,
  ])

  const isValid = useMemo(() => {
    if (!state.title || !state.linkUrl) {
      return false
    }

    try {
      new URL(state.linkUrl)
    } catch {
      return false
    }

    if (!scheduledAt) {
      return false
    }

    return true
  }, [state.title, state.linkUrl, scheduledAt])

  const hasChanges = useMemo(() => {
    return (
      state.title !== '' ||
      state.linkUrl !== '' ||
      state.scheduledYear !== '' ||
      state.scheduledMonth !== '' ||
      state.scheduledDay !== '' ||
      state.scheduledHour !== '' ||
      state.scheduledMinute !== ''
    )
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
      setScheduledYear,
      setScheduledMonth,
      setScheduledDay,
      setScheduledHour,
      setScheduledMinute,
      validate,
      reset,
    },
  }
}
