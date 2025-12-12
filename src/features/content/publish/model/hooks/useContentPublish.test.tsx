/**
 * useContentPublish 훅 테스트
 *
 * api-usage-guide.md 기준 테스트 시나리오:
 *
 * | 공개여부     | 알람설정 | API 호출 순서 |
 * |-------------|---------|--------------|
 * | 공개        | 미발송   | ① POST /contents → ② PATCH /contents/{id}/status |
 * | 공개        | 발송     | ① POST /contents → ② PATCH /contents/{id}/status → ③ POST /notifications |
 * | 비공개      | -       | ① POST /contents |
 * | 예약발행    | 미발송   | ① POST /contents → ② POST /contents/{id}/schedule |
 * | 예약발행    | 발송     | ① POST /contents → ② POST /contents/{id}/schedule → ③ POST /notifications |
 *
 * 수정 모드:
 * | 공개여부     | 알람설정 | API 호출 순서 |
 * |-------------|---------|--------------|
 * | 공개        | 미발송   | ① PUT /contents/{id} → ② PATCH /contents/{id}/status |
 * | 공개        | 발송     | ① PUT /contents/{id} → ② PATCH /contents/{id}/status → ③ POST /notifications |
 * | 비공개      | -       | ① PUT /contents/{id} |
 * | 예약발행    | 미발송   | ① PUT /contents/{id} → ② POST /contents/{id}/schedule |
 * | 예약발행    | 발송     | ① PUT /contents/{id} → ② POST /contents/{id}/schedule → ③ POST /notifications |
 *
 * 추가 검증:
 * - 알람 scheduledAt 규칙:
 *   - 즉시 공개 + 알람: scheduledAt 없음 (즉시 발송)
 *   - 예약 발행 + 알람: scheduledAt = 콘텐츠 publishedAt
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

// API 함수들 모킹
vi.mock('@/features/content/create', () => ({
  useCreateContent: vi.fn(),
}))
vi.mock('@/features/content/edit', () => ({
  useUpdateContent: vi.fn(),
}))
vi.mock('@/features/notification/create', () => ({
  useCreateNotification: vi.fn(),
  useUpdateNotification: vi.fn(),
  useDeleteNotification: vi.fn(),
  useScheduleNotification: vi.fn(),
}))
vi.mock('../../api/queries/usePublishContent', () => ({
  usePublishContent: vi.fn(),
  useScheduleContent: vi.fn(),
}))

import { useContentPublish } from './useContentPublish'
import type { ContentData, PublishOptionsInput, ExistingNotification } from './useContentPublish'
import { useCreateContent } from '@/features/content/create'
import { useUpdateContent } from '@/features/content/edit'
import { useCreateNotification, useUpdateNotification, useDeleteNotification, useScheduleNotification } from '@/features/notification/create'
import { usePublishContent, useScheduleContent } from '../../api/queries/usePublishContent'

// 테스트 유틸리티
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// Mock 함수들
const mockCreateContent = vi.fn()
const mockUpdateContent = vi.fn()
const mockPublishContent = vi.fn()
const mockScheduleContent = vi.fn()
const mockCreateNotification = vi.fn()
const mockUpdateNotification = vi.fn()
const mockDeleteNotification = vi.fn()
const mockScheduleNotification = vi.fn()

// 기본 콘텐츠 데이터
const defaultContentData: ContentData = {
  title: '테스트 제목',
  body: '테스트 내용',
  category: '일반,공지',
  linkUrl: 'https://example.com',
}

// 기존 알람 Mock 데이터
const existingNotification: ExistingNotification = {
  id: 999,
  title: '기존 알람 제목',
  targetType: 'all',
  scheduledAt: '2025-01-15T10:00:00Z',
}

// 테스트용 Mock 설정
const setupMocks = () => {
  mockCreateContent.mockResolvedValue({ data: { id: 123 } })
  mockUpdateContent.mockResolvedValue({ data: { id: 456 } })
  mockPublishContent.mockResolvedValue({ success: true })
  mockScheduleContent.mockResolvedValue({ success: true })
  mockCreateNotification.mockResolvedValue({ data: { id: 789 } })
  mockUpdateNotification.mockResolvedValue({ success: true })
  mockDeleteNotification.mockResolvedValue({ success: true })
  mockScheduleNotification.mockResolvedValue({ success: true })

  ;(useCreateContent as Mock).mockReturnValue({
    mutateAsync: mockCreateContent,
    isPending: false,
  })
  ;(useUpdateContent as Mock).mockReturnValue({
    mutateAsync: mockUpdateContent,
    isPending: false,
  })
  ;(usePublishContent as Mock).mockReturnValue({
    mutateAsync: mockPublishContent,
    isPending: false,
  })
  ;(useScheduleContent as Mock).mockReturnValue({
    mutateAsync: mockScheduleContent,
    isPending: false,
  })
  ;(useCreateNotification as Mock).mockReturnValue({
    mutateAsync: mockCreateNotification,
    isPending: false,
  })
  ;(useUpdateNotification as Mock).mockReturnValue({
    mutateAsync: mockUpdateNotification,
    isPending: false,
  })
  ;(useDeleteNotification as Mock).mockReturnValue({
    mutateAsync: mockDeleteNotification,
    isPending: false,
  })
  ;(useScheduleNotification as Mock).mockReturnValue({
    mutateAsync: mockScheduleNotification,
    isPending: false,
  })
}

describe('useContentPublish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupMocks()
  })

  describe('신규 작성 모드 (isEditMode: false)', () => {
    describe('공개 + 미발송', () => {
      it('콘텐츠 생성 후 상태를 public으로 변경한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: false }),
          { wrapper: createWrapper() }
        )

        const options: PublishOptionsInput = {
          visibility: 'public',
          sendAlarm: false,
        }

        await result.current.execute(defaultContentData, options)

        // Step 1: POST /contents 호출
        expect(mockCreateContent).toHaveBeenCalledWith({
          title: '테스트 제목',
          body: '테스트 내용',
          category: '일반,공지',
          linkUrl: 'https://example.com',
        })

        // Step 2: PATCH /contents/{id}/status 호출
        expect(mockPublishContent).toHaveBeenCalledWith({
          id: 123,
          status: 'public',
        })

        // 알람 생성 안함
        expect(mockCreateNotification).not.toHaveBeenCalled()
      })
    })

    describe('공개 + 발송', () => {
      it('콘텐츠 생성 후 상태 변경 후 알람을 생성한다 (scheduledAt 없음)', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: false }),
          { wrapper: createWrapper() }
        )

        const options: PublishOptionsInput = {
          visibility: 'public',
          sendAlarm: true,
          alarmTarget: 'all',
          alarmTitle: '알람 제목',
        }

        await result.current.execute(defaultContentData, options)

        // Step 1: POST /contents
        expect(mockCreateContent).toHaveBeenCalled()

        // Step 2: PATCH /contents/{id}/status
        expect(mockPublishContent).toHaveBeenCalledWith({
          id: 123,
          status: 'public',
        })

        // Step 3: POST /notifications (즉시 공개이므로 scheduledAt 없음)
        expect(mockCreateNotification).toHaveBeenCalledWith({
          title: '알람 제목',
          contentId: 123,
          targetType: 'all',
          scheduledAt: undefined,
        })
      })
    })

    describe('비공개', () => {
      it('콘텐츠만 생성하고 상태 변경 없음', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: false }),
          { wrapper: createWrapper() }
        )

        const options: PublishOptionsInput = {
          visibility: 'private',
          sendAlarm: false,
        }

        await result.current.execute(defaultContentData, options)

        // Step 1: POST /contents
        expect(mockCreateContent).toHaveBeenCalled()

        // 상태 변경 없음
        expect(mockPublishContent).not.toHaveBeenCalled()
        expect(mockScheduleContent).not.toHaveBeenCalled()

        // 알람 생성 없음
        expect(mockCreateNotification).not.toHaveBeenCalled()
      })
    })

    describe('예약발행 + 미발송', () => {
      it('콘텐츠 생성 후 예약 발행 설정', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: false }),
          { wrapper: createWrapper() }
        )

        const scheduledAt = '2025-01-15T10:00:00Z'
        const options: PublishOptionsInput = {
          visibility: 'scheduled',
          scheduledAt,
          sendAlarm: false,
        }

        await result.current.execute(defaultContentData, options)

        // Step 1: POST /contents
        expect(mockCreateContent).toHaveBeenCalled()

        // Step 2: POST /contents/{id}/schedule
        expect(mockScheduleContent).toHaveBeenCalledWith({
          id: 123,
          publishedAt: scheduledAt,
        })

        // 상태 변경 없음 (schedule이 대신함)
        expect(mockPublishContent).not.toHaveBeenCalled()

        // 알람 생성 없음
        expect(mockCreateNotification).not.toHaveBeenCalled()
      })
    })

    describe('예약발행 + 발송', () => {
      it('콘텐츠 생성 후 예약 발행 설정 후 알람 생성 (scheduledAt = publishedAt)', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: false }),
          { wrapper: createWrapper() }
        )

        const scheduledAt = '2025-01-15T10:00:00Z'
        const options: PublishOptionsInput = {
          visibility: 'scheduled',
          scheduledAt,
          sendAlarm: true,
          alarmTarget: 'follower',
          alarmTitle: '예약 알람',
        }

        await result.current.execute(defaultContentData, options)

        // Step 1: POST /contents
        expect(mockCreateContent).toHaveBeenCalled()

        // Step 2: POST /contents/{id}/schedule
        expect(mockScheduleContent).toHaveBeenCalledWith({
          id: 123,
          publishedAt: scheduledAt,
        })

        // Step 3: POST /notifications (예약발행이므로 scheduledAt = 콘텐츠 발행 시간)
        expect(mockCreateNotification).toHaveBeenCalledWith({
          title: '예약 알람',
          contentId: 123,
          targetType: 'follower',
          scheduledAt: scheduledAt, // 콘텐츠 발행 시간과 동일
        })
      })
    })
  })

  describe('수정 모드 (isEditMode: true)', () => {
    const contentId = 456

    describe('공개 + 미발송', () => {
      it('콘텐츠 수정 후 상태를 public으로 변경한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: true, contentId }),
          { wrapper: createWrapper() }
        )

        const options: PublishOptionsInput = {
          visibility: 'public',
          sendAlarm: false,
        }

        await result.current.execute(defaultContentData, options)

        // Step 1: PUT /contents/{id} 호출
        expect(mockUpdateContent).toHaveBeenCalledWith({
          id: contentId,
          title: '테스트 제목',
          body: '테스트 내용',
          category: '일반,공지',
          linkUrl: 'https://example.com',
        })

        // 생성은 호출되지 않음
        expect(mockCreateContent).not.toHaveBeenCalled()

        // Step 2: PATCH /contents/{id}/status
        expect(mockPublishContent).toHaveBeenCalledWith({
          id: contentId,
          status: 'public',
        })
      })
    })

    describe('공개 + 발송', () => {
      it('콘텐츠 수정 후 상태 변경 후 알람을 생성한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: true, contentId }),
          { wrapper: createWrapper() }
        )

        const options: PublishOptionsInput = {
          visibility: 'public',
          sendAlarm: true,
          alarmTarget: 'member',
          alarmTitle: '수정된 콘텐츠 알람',
        }

        await result.current.execute(defaultContentData, options)

        // Step 1: PUT /contents/{id}
        expect(mockUpdateContent).toHaveBeenCalled()

        // Step 2: PATCH /contents/{id}/status
        expect(mockPublishContent).toHaveBeenCalled()

        // Step 3: POST /notifications
        expect(mockCreateNotification).toHaveBeenCalledWith({
          title: '수정된 콘텐츠 알람',
          contentId,
          targetType: 'member',
          scheduledAt: undefined,
        })
      })
    })

    describe('비공개', () => {
      it('콘텐츠만 수정하고 상태 변경 없음', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: true, contentId }),
          { wrapper: createWrapper() }
        )

        const options: PublishOptionsInput = {
          visibility: 'private',
          sendAlarm: false,
        }

        await result.current.execute(defaultContentData, options)

        // PUT /contents/{id}
        expect(mockUpdateContent).toHaveBeenCalled()

        // 상태 변경 없음
        expect(mockPublishContent).not.toHaveBeenCalled()
        expect(mockScheduleContent).not.toHaveBeenCalled()
      })
    })

    describe('예약발행 + 미발송', () => {
      it('콘텐츠 수정 후 예약 발행 설정', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: true, contentId }),
          { wrapper: createWrapper() }
        )

        const scheduledAt = '2025-02-20T15:30:00Z'
        const options: PublishOptionsInput = {
          visibility: 'scheduled',
          scheduledAt,
          sendAlarm: false,
        }

        await result.current.execute(defaultContentData, options)

        // PUT /contents/{id}
        expect(mockUpdateContent).toHaveBeenCalled()

        // POST /contents/{id}/schedule
        expect(mockScheduleContent).toHaveBeenCalledWith({
          id: contentId,
          publishedAt: scheduledAt,
        })
      })
    })

    describe('예약발행 + 발송', () => {
      it('콘텐츠 수정 후 예약 발행 설정 후 알람 생성', async () => {
        const { result } = renderHook(
          () => useContentPublish({ isEditMode: true, contentId }),
          { wrapper: createWrapper() }
        )

        const scheduledAt = '2025-02-20T15:30:00Z'
        const options: PublishOptionsInput = {
          visibility: 'scheduled',
          scheduledAt,
          sendAlarm: true,
          alarmTarget: 'all',
          alarmTitle: '예약 수정 알람',
        }

        await result.current.execute(defaultContentData, options)

        // PUT /contents/{id}
        expect(mockUpdateContent).toHaveBeenCalled()

        // POST /contents/{id}/schedule
        expect(mockScheduleContent).toHaveBeenCalledWith({
          id: contentId,
          publishedAt: scheduledAt,
        })

        // POST /notifications
        expect(mockCreateNotification).toHaveBeenCalledWith({
          title: '예약 수정 알람',
          contentId,
          targetType: 'all',
          scheduledAt, // 콘텐츠 발행 시간과 동일
        })
      })
    })
  })

  describe('반환값 검증', () => {
    it('성공 시 contentId를 반환한다 (신규)', async () => {
      const { result } = renderHook(
        () => useContentPublish({ isEditMode: false }),
        { wrapper: createWrapper() }
      )

      const response = await result.current.execute(defaultContentData, {
        visibility: 'public',
        sendAlarm: false,
      })

      expect(response.success).toBe(true)
      expect(response.contentId).toBe(123)
    })

    it('성공 시 contentId를 반환한다 (수정)', async () => {
      const { result } = renderHook(
        () => useContentPublish({ isEditMode: true, contentId: 456 }),
        { wrapper: createWrapper() }
      )

      const response = await result.current.execute(defaultContentData, {
        visibility: 'public',
        sendAlarm: false,
      })

      expect(response.success).toBe(true)
      expect(response.contentId).toBe(456)
    })

    it('알람 생성 시 notificationId도 반환한다', async () => {
      const { result } = renderHook(
        () => useContentPublish({ isEditMode: false }),
        { wrapper: createWrapper() }
      )

      const response = await result.current.execute(defaultContentData, {
        visibility: 'public',
        sendAlarm: true,
        alarmTarget: 'all',
        alarmTitle: '알람',
      })

      expect(response.notificationId).toBe(789)
    })
  })

  describe('API 호출 순서 검증', () => {
    it('공개 + 알람: 생성 → 상태변경 → 알람 순서로 호출된다', async () => {
      const callOrder: string[] = []

      mockCreateContent.mockImplementation(async () => {
        callOrder.push('createContent')
        return { data: { id: 123 } }
      })
      mockPublishContent.mockImplementation(async () => {
        callOrder.push('publishContent')
        return { success: true }
      })
      mockCreateNotification.mockImplementation(async () => {
        callOrder.push('createNotification')
        return { data: { id: 789 } }
      })

      const { result } = renderHook(
        () => useContentPublish({ isEditMode: false }),
        { wrapper: createWrapper() }
      )

      await result.current.execute(defaultContentData, {
        visibility: 'public',
        sendAlarm: true,
        alarmTarget: 'all',
        alarmTitle: '순서 테스트',
      })

      expect(callOrder).toEqual(['createContent', 'publishContent', 'createNotification'])
    })

    it('예약발행 + 알람: 생성 → 예약 → 알람 순서로 호출된다', async () => {
      const callOrder: string[] = []

      mockCreateContent.mockImplementation(async () => {
        callOrder.push('createContent')
        return { data: { id: 123 } }
      })
      mockScheduleContent.mockImplementation(async () => {
        callOrder.push('scheduleContent')
        return { success: true }
      })
      mockCreateNotification.mockImplementation(async () => {
        callOrder.push('createNotification')
        return { data: { id: 789 } }
      })

      const { result } = renderHook(
        () => useContentPublish({ isEditMode: false }),
        { wrapper: createWrapper() }
      )

      await result.current.execute(defaultContentData, {
        visibility: 'scheduled',
        scheduledAt: '2025-01-15T10:00:00Z',
        sendAlarm: true,
        alarmTarget: 'all',
        alarmTitle: '순서 테스트',
      })

      expect(callOrder).toEqual(['createContent', 'scheduleContent', 'createNotification'])
    })
  })

  describe('알람 대상자 (target_type) 검증', () => {
    it.each([
      ['all', 'all'],
      ['follower', 'follower'],
      ['member', 'member'],
    ] as const)('alarmTarget이 %s일 때 targetType으로 %s를 전달한다', async (input, expected) => {
      const { result } = renderHook(
        () => useContentPublish({ isEditMode: false }),
        { wrapper: createWrapper() }
      )

      await result.current.execute(defaultContentData, {
        visibility: 'public',
        sendAlarm: true,
        alarmTarget: input,
        alarmTitle: '대상자 테스트',
      })

      expect(mockCreateNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          targetType: expected,
        })
      )
    })
  })

  /**
   * 복합 수정 시나리오 테스트
   * api-usage-guide.md 4.5 복합 시나리오 기준
   */
  describe('복합 수정 시나리오 (기존 상태 + 알람 변경)', () => {
    const contentId = 456

    describe('scheduled → private (스케줄 취소)', () => {
      it('예약발행 상태에서 비공개로 변경하면 스케줄이 취소된다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'private',
          sendAlarm: false,
        })

        // 콘텐츠 수정
        expect(mockUpdateContent).toHaveBeenCalled()

        // 상태를 private으로 변경 (스케줄 취소 효과)
        expect(mockPublishContent).toHaveBeenCalledWith({
          id: contentId,
          status: 'private',
        })
      })

      it('예약발행 + 기존 알람이 있으면 알람도 삭제한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'private',
          sendAlarm: false,
        })

        // 상태를 private으로 변경
        expect(mockPublishContent).toHaveBeenCalledWith({
          id: contentId,
          status: 'private',
        })

        // 기존 알람 삭제
        expect(mockDeleteNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
        })
      })
    })

    describe('scheduled → public (즉시 공개)', () => {
      it('예약발행에서 즉시 공개로 변경하면 상태만 변경된다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'public',
          sendAlarm: false,
        })

        // 콘텐츠 수정
        expect(mockUpdateContent).toHaveBeenCalled()

        // 상태를 public으로 변경
        expect(mockPublishContent).toHaveBeenCalledWith({
          id: contentId,
          status: 'public',
        })

        // 스케줄 API는 호출하지 않음
        expect(mockScheduleContent).not.toHaveBeenCalled()
      })

      it('기존 알람이 있고 알람 발송 시 알람을 수정한다 (scheduledAt 제거)', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'public',
          sendAlarm: true,
          alarmTarget: 'all',
          alarmTitle: '즉시 발송 알람',
        })

        // 상태를 public으로 변경
        expect(mockPublishContent).toHaveBeenCalled()

        // 기존 알람 수정 (즉시 발송으로 변경)
        expect(mockUpdateNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
          title: '즉시 발송 알람',
          targetType: 'all',
        })

        // 새 알람 생성은 하지 않음
        expect(mockCreateNotification).not.toHaveBeenCalled()
      })

      it('기존 알람이 있고 알람 미발송 시 알람을 삭제한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'public',
          sendAlarm: false,
        })

        // 기존 알람 삭제
        expect(mockDeleteNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
        })
      })
    })

    describe('scheduled → scheduled (예약 시간 변경)', () => {
      it('예약 시간 변경 시 스케줄을 업데이트한다', async () => {
        const newScheduledAt = '2025-02-20T15:00:00Z'

        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'scheduled',
          scheduledAt: newScheduledAt,
          sendAlarm: false,
        })

        // 콘텐츠 수정
        expect(mockUpdateContent).toHaveBeenCalled()

        // 새 스케줄 등록 (기존 스케줄 덮어쓰기)
        expect(mockScheduleContent).toHaveBeenCalledWith({
          id: contentId,
          publishedAt: newScheduledAt,
        })
      })

      it('예약 시간 변경 + 기존 알람 있으면 알람 예약시간도 변경한다', async () => {
        const newScheduledAt = '2025-02-20T15:00:00Z'

        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'scheduled',
          scheduledAt: newScheduledAt,
          sendAlarm: true,
          alarmTarget: 'all',
          alarmTitle: '기존 알람 제목',
        })

        // 스케줄 업데이트
        expect(mockScheduleContent).toHaveBeenCalled()

        // 알람 예약 시간 변경
        expect(mockScheduleNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
          scheduledAt: newScheduledAt,
        })
      })

      it('기존 알람이 있고 알람 미발송으로 변경하면 알람 삭제', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'scheduled',
          scheduledAt: '2025-02-20T15:00:00Z',
          sendAlarm: false,
        })

        // 기존 알람 삭제
        expect(mockDeleteNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
        })
      })
    })

    describe('public → private', () => {
      it('공개에서 비공개로 변경하면 상태만 변경된다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'public',
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'private',
          sendAlarm: false,
        })

        // 콘텐츠 수정
        expect(mockUpdateContent).toHaveBeenCalled()

        // 상태를 private으로 변경
        expect(mockPublishContent).toHaveBeenCalledWith({
          id: contentId,
          status: 'private',
        })
      })

      it('기존 알람이 있으면 알람을 삭제한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'public',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'private',
          sendAlarm: false,
        })

        // 기존 알람 삭제
        expect(mockDeleteNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
        })
      })
    })

    describe('public → scheduled (불가)', () => {
      it('한 번 공개된 콘텐츠는 예약발행으로 변경할 수 없다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'public',
          }),
          { wrapper: createWrapper() }
        )

        await expect(
          result.current.execute(defaultContentData, {
            visibility: 'scheduled',
            scheduledAt: '2025-02-20T15:00:00Z',
            sendAlarm: false,
          })
        ).rejects.toThrow('한 번 공개된 콘텐츠는 예약발행할 수 없습니다')

        // 스케줄 API 호출하지 않음
        expect(mockScheduleContent).not.toHaveBeenCalled()
      })
    })

    describe('알람만 변경 (상태 유지)', () => {
      it('기존 알람이 있고 제목만 변경하면 알람을 수정한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'scheduled',
          scheduledAt: existingNotification.scheduledAt, // 동일한 시간
          sendAlarm: true,
          alarmTarget: 'all',
          alarmTitle: '변경된 알람 제목', // 제목만 변경
        })

        // 알람 수정
        expect(mockUpdateNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
          title: '변경된 알람 제목',
          targetType: 'all',
        })
      })

      it('기존 알람이 있고 대상자만 변경하면 알람을 수정한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'scheduled',
          scheduledAt: existingNotification.scheduledAt,
          sendAlarm: true,
          alarmTarget: 'follower', // 대상자 변경
          alarmTitle: existingNotification.title,
        })

        // 알람 수정
        expect(mockUpdateNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
          title: existingNotification.title,
          targetType: 'follower',
        })
      })

      it('기존 알람이 없고 알람 발송으로 설정하면 알람을 생성한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'scheduled',
            // existingNotification 없음
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'scheduled',
          scheduledAt: '2025-02-20T15:00:00Z',
          sendAlarm: true,
          alarmTarget: 'all',
          alarmTitle: '새 알람',
        })

        // 새 알람 생성
        expect(mockCreateNotification).toHaveBeenCalledWith({
          title: '새 알람',
          contentId,
          targetType: 'all',
          scheduledAt: '2025-02-20T15:00:00Z',
        })
      })

      it('기존 알람이 있고 알람 미발송으로 변경하면 알람을 삭제한다', async () => {
        const { result } = renderHook(
          () => useContentPublish({
            isEditMode: true,
            contentId,
            previousState: 'public',
            existingNotification,
          }),
          { wrapper: createWrapper() }
        )

        await result.current.execute(defaultContentData, {
          visibility: 'public', // 상태 유지
          sendAlarm: false, // 알람 미발송으로 변경
        })

        // 기존 알람 삭제
        expect(mockDeleteNotification).toHaveBeenCalledWith({
          id: existingNotification.id,
        })

        // 상태는 이미 public이므로 상태 변경 API 호출하지 않음
        expect(mockPublishContent).not.toHaveBeenCalled()
      })
    })
  })
})
