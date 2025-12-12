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

function parseScheduledAt(scheduledAt: string | null | undefined): Date | null {
  if (!scheduledAt) {
    return null
  }

  const date = new Date(scheduledAt)
  if (isNaN(date.getTime())) {
    return null
  }

  return date
}

function createInitialState(initialState?: InitialPublishState): PublishOptionsState {
  if (!initialState) {
    return initialPublishOptionsState
  }

  const visibility = initialState.visibility ?? 'public'
  const scheduledDate = visibility === 'scheduled'
    ? parseScheduledAt(initialState.scheduledAt)
    : null

  return {
    ...initialPublishOptionsState,
    visibility,
    scheduledDate,
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

  const setScheduledDate = useCallback((date: Date | null) => {
    setState((prev) => ({
      ...prev,
      scheduledDate: date,
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

  const validate = useCallback((): boolean => {
    const errors: PublishOptionsState['errors'] = {}

    if (state.visibility === 'scheduled') {
      if (!state.scheduledDate) {
        errors.scheduledAt = '예약 발행 시간을 선택해주세요'
      }
    }

    setState((prev) => ({ ...prev, errors }))

    return Object.keys(errors).length === 0
  }, [state])

  const reset = useCallback(() => {
    setState(createInitialState(initialState))
  }, [initialState])

  const scheduledAt = useMemo(() => {
    if (!state.scheduledDate) {
      return null
    }
    return state.scheduledDate.toISOString()
  }, [state.scheduledDate])

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
      setScheduledDate,
      setSendAlarm,
      setAlarmTarget,
      setAlarmTitleStrategy,
      setAlarmCustomTitle,
      validate,
      reset,
    },
  }
}
