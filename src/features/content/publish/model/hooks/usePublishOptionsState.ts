import { useState, useCallback, useMemo } from 'react'
import type {
  PublishOptionsState,
  Visibility,
  NotificationTarget,
  TitleStrategy,
} from '../types'
import { initialPublishOptionsState } from '../types'

interface UsePublishOptionsStateOptions {
  contentTitle?: string
}

export function usePublishOptionsState(options: UsePublishOptionsStateOptions = {}) {
  const { contentTitle = '' } = options
  const [state, setState] = useState<PublishOptionsState>(initialPublishOptionsState)

  const setVisibility = useCallback((visibility: Visibility) => {
    setState((prev) => ({
      ...prev,
      visibility,
      errors: { ...prev.errors, scheduledAt: undefined },
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

  const setSendAlarm = useCallback((sendAlarm: boolean) => {
    setState((prev) => ({
      ...prev,
      sendAlarm,
    }))
  }, [])

  const setAlarmTarget = useCallback((target: NotificationTarget) => {
    setState((prev) => ({
      ...prev,
      alarmTarget: target,
    }))
  }, [])

  const setAlarmTitleStrategy = useCallback(
    (strategy: TitleStrategy) => {
      setState((prev) => ({
        ...prev,
        alarmTitleStrategy: strategy,
        alarmCustomTitle:
          strategy === 'content-title' ? contentTitle : prev.alarmCustomTitle,
      }))
    },
    [contentTitle]
  )

  const setAlarmCustomTitle = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      alarmCustomTitle: title,
    }))
  }, [])

  const setAlarmBody = useCallback((body: string) => {
    setState((prev) => ({
      ...prev,
      alarmBody: body,
      errors: { ...prev.errors, alarmBody: undefined },
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const errors: PublishOptionsState['errors'] = {}

    if (state.visibility === 'scheduled') {
      if (
        !state.scheduledYear ||
        !state.scheduledMonth ||
        !state.scheduledDay ||
        !state.scheduledHour ||
        !state.scheduledMinute
      ) {
        errors.scheduledAt = '예약 발행 시간을 선택해주세요'
      }
    }

    if (state.sendAlarm && !state.alarmBody) {
      errors.alarmBody = '알람 내용을 입력해주세요'
    }

    setState((prev) => ({ ...prev, errors }))

    return Object.keys(errors).length === 0
  }, [state])

  const reset = useCallback(() => {
    setState(initialPublishOptionsState)
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

  const showAlarmOptions = useMemo(() => {
    return state.visibility === 'public' || state.visibility === 'scheduled'
  }, [state.visibility])

  const alarmTitle = useMemo(() => {
    return state.alarmTitleStrategy === 'content-title'
      ? contentTitle
      : state.alarmCustomTitle
  }, [state.alarmTitleStrategy, state.alarmCustomTitle, contentTitle])

  return {
    state,
    scheduledAt,
    showAlarmOptions,
    alarmTitle,
    actions: {
      setVisibility,
      setScheduledYear,
      setScheduledMonth,
      setScheduledDay,
      setScheduledHour,
      setScheduledMinute,
      setSendAlarm,
      setAlarmTarget,
      setAlarmTitleStrategy,
      setAlarmCustomTitle,
      setAlarmBody,
      validate,
      reset,
    },
  }
}
