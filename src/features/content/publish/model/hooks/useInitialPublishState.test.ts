import { describe, it, expect } from 'vitest'
import type { Content, ContentSchedule } from '@/entities/content'
import {
  calculateInitialPublishState,
  calculatePreviousState,
} from './useInitialPublishState'

// Mock Content 생성 헬퍼
function createMockContent(overrides: Partial<Content> = {}): Content {
  return {
    id: 1,
    title: 'Test Content',
    body: 'Test Body',
    category: '일반',
    linkUrl: null,
    status: 'public',
    userId: 1,
    user: {
      id: 1,
      email: 'test@test.com',
    },
    stats: {
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    publishedAt: null,
    ...overrides,
  }
}

// Mock ContentSchedule 생성 헬퍼
function createMockSchedule(overrides: Partial<ContentSchedule> = {}): ContentSchedule {
  return {
    content_id: 1,
    is_scheduled: false,
    published_at: null,
    ...overrides,
  }
}

describe('calculateInitialPublishState', () => {
  it('content가 undefined이면 undefined를 반환한다', () => {
    const result = calculateInitialPublishState(undefined, createMockSchedule())
    expect(result).toBeUndefined()
  })

  it('schedule이 undefined이면 undefined를 반환한다', () => {
    const result = calculateInitialPublishState(createMockContent(), undefined)
    expect(result).toBeUndefined()
  })

  it('status가 public이면 공개', () => {
    const content = createMockContent({ status: 'public' })
    const schedule = createMockSchedule()

    const result = calculateInitialPublishState(content, schedule)

    expect(result?.visibility).toBe('public')
  })

  it('status가 private이고 is_scheduled가 true이면 예약발행', () => {
    const content = createMockContent({ status: 'private' })
    const schedule = createMockSchedule({
      is_scheduled: true,
      published_at: '2024-06-01T10:00:00Z',
    })

    const result = calculateInitialPublishState(content, schedule)

    expect(result?.visibility).toBe('scheduled')
    expect(result?.scheduledAt).toBe('2024-06-01T10:00:00Z')
  })

  it('status가 private이고 is_scheduled가 false이면 비공개', () => {
    const content = createMockContent({ status: 'private' })
    const schedule = createMockSchedule({ is_scheduled: false })

    const result = calculateInitialPublishState(content, schedule)

    expect(result?.visibility).toBe('private')
  })
})

describe('calculatePreviousState', () => {
  it('content가 undefined이면 undefined를 반환한다', () => {
    const result = calculatePreviousState(undefined, createMockSchedule())
    expect(result).toBeUndefined()
  })

  it('schedule이 undefined이면 undefined를 반환한다', () => {
    const result = calculatePreviousState(createMockContent(), undefined)
    expect(result).toBeUndefined()
  })

  it('status가 public이면 public', () => {
    const content = createMockContent({ status: 'public' })
    const schedule = createMockSchedule()

    const result = calculatePreviousState(content, schedule)

    expect(result).toBe('public')
  })

  it('status가 private이고 is_scheduled가 true이면 scheduled', () => {
    const content = createMockContent({ status: 'private' })
    const schedule = createMockSchedule({ is_scheduled: true })

    const result = calculatePreviousState(content, schedule)

    expect(result).toBe('scheduled')
  })

  it('status가 private이고 is_scheduled가 false이면 private', () => {
    const content = createMockContent({ status: 'private' })
    const schedule = createMockSchedule({ is_scheduled: false })

    const result = calculatePreviousState(content, schedule)

    expect(result).toBe('private')
  })
})
