import type { UserSummary } from '@/entities/user'
import type { Content } from '@/entities/content'

export type NotificationTarget = 'all' | 'follower' | 'member'

export type NotificationStatus = 'draft' | 'scheduled' | 'sent' | 'public' | 'private'

export interface NotificationStats {
  successCount: number
  failureCount: number
}

export interface Notification {
  id: number
  title: string
  contentId: number
  content: Content
  targetType: NotificationTarget
  status: NotificationStatus
  scheduledAt: string | null
  sentAt: string | null
  creatorId: number
  creator: UserSummary
  stats: NotificationStats
  createdAt: string
  updatedAt: string
}

// API 응답 타입 (snake_case)
export interface NotificationApiResponse {
  id: number
  title: string
  content_id: number
  content: Content
  target_type: NotificationTarget
  status: NotificationStatus
  scheduled_at: string | null
  sent_at: string | null
  creator_id: number
  creator: UserSummary
  stats: {
    success_count: number
    failure_count: number
  }
  created_at: string
  updated_at: string
}

export function mapNotificationFromApi(api: NotificationApiResponse): Notification {
  return {
    id: api.id,
    title: api.title,
    contentId: api.content_id,
    content: api.content,
    targetType: api.target_type,
    status: api.status,
    scheduledAt: api.scheduled_at,
    sentAt: api.sent_at,
    creatorId: api.creator_id,
    creator: api.creator,
    stats: {
      successCount: api.stats.success_count,
      failureCount: api.stats.failure_count,
    },
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  }
}

export interface NotificationListApiResponse {
  success: boolean
  data: {
    notifications: NotificationApiResponse[]
    page: number
    limit: number
    total: number
  }
}

export interface NotificationApiResponseWrapper {
  success: boolean
  data: NotificationApiResponse
}

export interface NotificationListResponse {
  success: boolean
  data: {
    notifications: Notification[]
    page: number
    limit: number
    total: number
  }
}

export interface NotificationResponse {
  success: boolean
  data: Notification
}

export interface NotificationListParams {
  page?: number
  limit?: number
  status?: 'public' | 'private'
  targetType?: NotificationTarget
}
