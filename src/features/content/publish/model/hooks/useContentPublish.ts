import { useCallback } from 'react'
import { useCreateContent } from '@/features/content/create'
import { useUpdateContent } from '@/features/content/edit'
import {
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
  useScheduleNotification,
} from '@/features/notification/create'
import { usePublishContent, useScheduleContent } from '../../api/queries/usePublishContent'
import type { Visibility, NotificationTarget } from '../types'

/**
 * 콘텐츠 데이터 (생성/수정용)
 */
export interface ContentData {
  title: string
  body: string
  category: string
  linkUrl?: string
}

/**
 * 발행 옵션
 */
export interface PublishOptionsInput {
  visibility: Visibility
  scheduledAt?: string // ISO 8601
  sendAlarm: boolean
  alarmTarget?: NotificationTarget
  alarmTitle?: string
  alarmBody?: string
}

/**
 * 콘텐츠의 기존 상태
 */
export type ExistingContentState = 'draft' | 'scheduled' | 'public' | 'private'

/**
 * 기존 알람 정보
 */
export interface ExistingNotification {
  id: number
  title: string
  targetType: NotificationTarget
  scheduledAt?: string
}

/**
 * useContentPublish 훅 파라미터
 */
export interface UseContentPublishParams {
  /** 수정 모드 여부 */
  isEditMode: boolean
  /** 수정 모드일 때 콘텐츠 ID */
  contentId?: number
  /** 수정 모드일 때 콘텐츠의 기존 상태 */
  previousState?: ExistingContentState
  /** 기존 알람 정보 (있는 경우) */
  existingNotification?: ExistingNotification
}

/**
 * 발행 실행 결과
 */
export interface PublishResult {
  success: boolean
  contentId: number
  notificationId?: number
}

/**
 * API 호출 순서 (api-usage-guide.md 기준)
 *
 * 신규 작성:
 * | 공개여부     | 알람설정 | API 호출 순서 |
 * |-------------|---------|--------------|
 * | 공개        | 미발송   | ① POST /contents → ② PATCH /contents/{id}/status |
 * | 공개        | 발송     | ① POST /contents → ② PATCH /contents/{id}/status → ③ POST /notifications |
 * | 비공개      | -       | ① POST /contents |
 * | 예약발행    | 미발송   | ① POST /contents → ② POST /contents/{id}/schedule |
 * | 예약발행    | 발송     | ① POST /contents → ② POST /contents/{id}/schedule → ③ POST /notifications |
 *
 * 수정 모드 (복합 시나리오):
 * - scheduled → private: PATCH status + DELETE notifications (if exists)
 * - scheduled → public: PATCH status + UPDATE/DELETE notifications
 * - public → private: PATCH status + DELETE notifications (if exists)
 * - public → scheduled: 불가 (한 번 공개된 콘텐츠는 예약발행 불가)
 */
export function useContentPublish({
  isEditMode,
  contentId,
  previousState,
  existingNotification,
}: UseContentPublishParams) {
  const { mutateAsync: createContent, isPending: isCreating } = useCreateContent()
  const { mutateAsync: updateContent, isPending: isUpdating } = useUpdateContent()
  const { mutateAsync: publishContent, isPending: isPublishing } = usePublishContent()
  const { mutateAsync: scheduleContent, isPending: isScheduling } = useScheduleContent()
  const { mutateAsync: createNotification, isPending: isCreatingNotification } = useCreateNotification()
  const { mutateAsync: updateNotification, isPending: isUpdatingNotification } = useUpdateNotification()
  const { mutateAsync: deleteNotification, isPending: isDeletingNotification } = useDeleteNotification()
  const { mutateAsync: scheduleNotification, isPending: isSchedulingNotification } = useScheduleNotification()

  const isPending =
    isCreating ||
    isUpdating ||
    isPublishing ||
    isScheduling ||
    isCreatingNotification ||
    isUpdatingNotification ||
    isDeletingNotification ||
    isSchedulingNotification

  /**
   * 콘텐츠 발행 실행
   */
  const execute = useCallback(
    async (contentData: ContentData, options: PublishOptionsInput): Promise<PublishResult> => {
      let targetContentId: number

      // 한 번 공개된 콘텐츠는 예약발행 불가
      if (isEditMode && previousState === 'public' && options.visibility === 'scheduled') {
        throw new Error('한 번 공개된 콘텐츠는 예약발행할 수 없습니다')
      }

      // Step 1: 콘텐츠 생성 또는 수정
      if (isEditMode && contentId) {
        await updateContent({
          id: contentId,
          title: contentData.title,
          body: contentData.body,
          category: contentData.category,
          linkUrl: contentData.linkUrl,
        })
        targetContentId = contentId
      } else {
        const response = await createContent({
          title: contentData.title,
          body: contentData.body,
          category: contentData.category,
          linkUrl: contentData.linkUrl,
        })
        targetContentId = response.data.id
      }

      // Step 2: 공개 상태에 따른 처리
      await handleVisibilityChange(targetContentId, options, previousState)

      // Step 3: 알람 처리
      const notificationId = await handleNotificationChange(targetContentId, options, existingNotification)

      return {
        success: true,
        contentId: targetContentId,
        notificationId,
      }
    },
    [
      isEditMode,
      contentId,
      previousState,
      existingNotification,
      createContent,
      updateContent,
      publishContent,
      scheduleContent,
      createNotification,
      updateNotification,
      deleteNotification,
      scheduleNotification,
    ]
  )

  /**
   * 공개 상태 변경 처리
   */
  const handleVisibilityChange = async (
    targetContentId: number,
    options: PublishOptionsInput,
    prevState?: ExistingContentState
  ) => {
    const { visibility, scheduledAt } = options

    // 신규 작성 또는 draft 상태에서의 변경
    if (!prevState || prevState === 'draft') {
      if (visibility === 'public') {
        await publishContent({ id: targetContentId, status: 'public' })
      } else if (visibility === 'scheduled' && scheduledAt) {
        await scheduleContent({ id: targetContentId, publishedAt: scheduledAt })
      }
      // private인 경우 상태 변경 없음
      return
    }

    // scheduled 상태에서의 변경
    if (prevState === 'scheduled') {
      if (visibility === 'private') {
        // 비공개로 변경 → 스케줄 취소
        await publishContent({ id: targetContentId, status: 'private' })
      } else if (visibility === 'public') {
        // 즉시 공개로 변경
        await publishContent({ id: targetContentId, status: 'public' })
      } else if (visibility === 'scheduled' && scheduledAt) {
        // 예약 시간 변경
        await scheduleContent({ id: targetContentId, publishedAt: scheduledAt })
      }
      return
    }

    // public 상태에서의 변경
    if (prevState === 'public') {
      if (visibility === 'private') {
        await publishContent({ id: targetContentId, status: 'private' })
      }
      // public 상태 유지인 경우 상태 변경 API 호출하지 않음
      return
    }

    // private 상태에서의 변경
    if (prevState === 'private') {
      if (visibility === 'public') {
        await publishContent({ id: targetContentId, status: 'public' })
      } else if (visibility === 'scheduled' && scheduledAt) {
        await scheduleContent({ id: targetContentId, publishedAt: scheduledAt })
      }
      // private 상태 유지인 경우 상태 변경 API 호출하지 않음
    }
  }

  /**
   * 알람 변경 처리
   */
  const handleNotificationChange = async (
    targetContentId: number,
    options: PublishOptionsInput,
    existing?: ExistingNotification
  ): Promise<number | undefined> => {
    const { visibility, scheduledAt, sendAlarm, alarmTarget, alarmTitle } = options

    // 비공개로 변경 시 기존 알람 삭제
    if (visibility === 'private' && existing) {
      await deleteNotification({ id: existing.id })
      return undefined
    }

    // 알람 미발송으로 변경 시 기존 알람 삭제
    if (!sendAlarm && existing) {
      await deleteNotification({ id: existing.id })
      return undefined
    }

    // 알람 발송 설정이 아니면 종료
    if (!sendAlarm || !alarmTarget || !alarmTitle) {
      return undefined
    }

    // 기존 알람이 있는 경우: 수정 또는 예약시간 변경
    if (existing) {
      // 예약 시간이 변경된 경우
      const isScheduledAtChanged =
        visibility === 'scheduled' && scheduledAt && existing.scheduledAt !== scheduledAt

      if (isScheduledAtChanged) {
        await scheduleNotification({
          id: existing.id,
          scheduledAt: scheduledAt!,
        })
      }

      // 제목 또는 대상자가 변경된 경우
      const isTitleChanged = alarmTitle !== existing.title
      const isTargetChanged = alarmTarget !== existing.targetType

      if (isTitleChanged || isTargetChanged || !isScheduledAtChanged) {
        await updateNotification({
          id: existing.id,
          title: alarmTitle,
          targetType: alarmTarget,
        })
      }

      return existing.id
    }

    // 기존 알람이 없는 경우: 새로 생성
    const notificationResponse = await createNotification({
      title: alarmTitle,
      contentId: targetContentId,
      targetType: alarmTarget,
      // 즉시 공개: scheduledAt 없음 (즉시 발송)
      // 예약 발행: 콘텐츠 발행 시간과 동일
      scheduledAt: visibility === 'scheduled' ? scheduledAt : undefined,
    })

    return notificationResponse.data.id
  }

  return {
    execute,
    isPending,
    isCreating,
    isUpdating,
    isPublishing,
    isScheduling,
    isCreatingNotification,
    isUpdatingNotification,
    isDeletingNotification,
    isSchedulingNotification,
  }
}
