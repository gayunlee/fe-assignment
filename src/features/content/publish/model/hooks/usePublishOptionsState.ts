import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type {
  PublishOptionsState,
  Visibility,
  NotificationTarget,
  TitleStrategy,
} from '../types'
import { initialPublishOptionsState } from '../types'

export interface InitialPublishState {
  visibility?: Visibility
  scheduledAt?: string | null // ISO string
}

interface UsePublishOptionsStateOptions {
  contentTitle?: string
  initialState?: InitialPublishState
}

function parseScheduledAt(scheduledAt: string | null | undefined): {
  year: string
  month: string
  day: string
  hour: string
  minute: string
} {
  if (!scheduledAt) {
    return { year: '', month: '', day: '', hour: '', minute: '' }
  }

  const date = new Date(scheduledAt)
  if (isNaN(date.getTime())) {
    return { year: '', month: '', day: '', hour: '', minute: '' }
  }

  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
    hour: String(date.getHours()).padStart(2, '0'),
    minute: String(date.getMinutes()).padStart(2, '0'),
  }
}

function createInitialState(initialState?: InitialPublishState): PublishOptionsState {
  if (!initialState) {
    return initialPublishOptionsState
  }

  const visibility = initialState.visibility ?? 'public'
  const scheduledParts = visibility === 'scheduled'
    ? parseScheduledAt(initialState.scheduledAt)
    : { year: '', month: '', day: '', hour: '', minute: '' }

  return {
    ...initialPublishOptionsState,
    visibility,
    scheduledYear: scheduledParts.year,
    scheduledMonth: scheduledParts.month,
    scheduledDay: scheduledParts.day,
    scheduledHour: scheduledParts.hour,
    scheduledMinute: scheduledParts.minute,
  }
}

export function usePublishOptionsState(options: UsePublishOptionsStateOptions = {}) {
  const { contentTitle = '', initialState } = options
  const [state, setState] = useState<PublishOptionsState>(() => createInitialState(initialState))

  // initialState가 변경되면 (비동기 로드 후) 상태 동기화
  const prevInitialStateRef = useRef(initialState)
  useEffect(() => {
    // initialState가 undefined에서 값으로 변경된 경우에만 동기화
    if (initialState && !prevInitialStateRef.current) {
      setState(createInitialState(initialState))
    }
    prevInitialStateRef.current = initialState
  }, [initialState])

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
    setState(createInitialState(initialState))
  }, [initialState])

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

    // 로컬 타임존 오프셋 계산 (예: +09:00)
    const date = new Date(
      Number(state.scheduledYear),
      Number(state.scheduledMonth) - 1,
      Number(state.scheduledDay),
      Number(state.scheduledHour),
      Number(state.scheduledMinute)
    )
    return date.toISOString()
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
