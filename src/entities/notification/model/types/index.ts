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
