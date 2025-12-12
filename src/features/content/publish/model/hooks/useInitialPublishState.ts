import { useMemo } from 'react'
import { useGetContent, useGetContentSchedule } from '@/entities/content'
import type { Content, ContentSchedule } from '@/entities/content'
import type { InitialPublishState } from './usePublishOptionsState'
import type { ExistingContentState } from './useContentPublish'

interface UseInitialPublishStateOptions {
  contentId?: number
  isEditMode: boolean
}

interface UseInitialPublishStateResult {
  content: Content | undefined
  initialPublishState: InitialPublishState | undefined
  previousState: ExistingContentState | undefined
  isLoading: boolean
}

/**
 * API 응답을 기반으로 InitialPublishState 계산
 * - status: 'public' → visibility: 'public'
 * - status: 'private' + isScheduled: true → visibility: 'scheduled'
 * - status: 'private' + isScheduled: false → visibility: 'private'
 */
export function calculateInitialPublishState(
  content: Content | undefined,
  schedule: ContentSchedule | undefined
): InitialPublishState | undefined {
  if (!content || !schedule) {
    return undefined
  }

  const { status } = content
  const { isScheduled, publishedAt } = schedule

  // private 상태이고 예약 발행이 설정된 경우 → 예약 발행
  if (status === 'private' && isScheduled) {
    return {
      visibility: 'scheduled',
      scheduledAt: publishedAt,
    }
  }

  // public → 공개
  if (status === 'public') {
    return {
      visibility: 'public',
      scheduledAt: null,
    }
  }

  // private (예약 없음) → 비공개
  if (status === 'private') {
    return {
      visibility: 'private',
      scheduledAt: null,
    }
  }

  return undefined
}

/**
 * API 응답을 기반으로 ExistingContentState 계산
 * - status: 'public' → 'public'
 * - status: 'private' + isScheduled: true → 'scheduled'
 * - status: 'private' + isScheduled: false → 'private'
 */
export function calculatePreviousState(
  content: Content | undefined,
  schedule: ContentSchedule | undefined
): ExistingContentState | undefined {
  if (!content || !schedule) {
    return undefined
  }

  const { status } = content
  const { isScheduled } = schedule

  // private 상태이고 예약 발행이 설정된 경우 → scheduled
  if (status === 'private' && isScheduled) {
    return 'scheduled'
  }

  // public 또는 private (예약 없음)
  return status
}

/**
 * 수정 모드에서 콘텐츠와 스케줄 API를 조회하여 발행 모달 초기값을 계산하는 훅
 */
export function useInitialPublishState({
  contentId,
  isEditMode,
}: UseInitialPublishStateOptions): UseInitialPublishStateResult {
  const { data: content, isLoading: isLoadingContent } = useGetContent(
    contentId ?? 0
  )
  const { data: schedule, isLoading: isLoadingSchedule } = useGetContentSchedule(
    contentId ?? 0
  )

  const initialPublishState = useMemo(() => {
    if (!isEditMode) {
      return undefined
    }
    return calculateInitialPublishState(content, schedule)
  }, [isEditMode, content, schedule])

  const previousState = useMemo(() => {
    if (!isEditMode) {
      return undefined
    }
    return calculatePreviousState(content, schedule)
  }, [isEditMode, content, schedule])

  const isLoading = isEditMode && (isLoadingContent || isLoadingSchedule)

  return {
    content,
    initialPublishState,
    previousState,
    isLoading,
  }
}
