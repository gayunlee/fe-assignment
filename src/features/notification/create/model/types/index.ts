import type { Notification, NotificationTarget } from '@/entities/notification'

export interface CreateNotificationRequest {
  title: string
  contentId: number
  targetType: NotificationTarget
  scheduledAt?: string // ISO 8601
}

export interface CreateNotificationApiRequest {
  title: string
  content_id: number
  target_type: NotificationTarget
  scheduled_at?: string
}

export interface CreateNotificationResponse {
  success: boolean
  data: Notification
}

export interface UpdateNotificationRequest {
  id: number
  title?: string
  contentId?: number
  targetType?: NotificationTarget
}

export interface UpdateNotificationApiRequest {
  title?: string
  content_id?: number
  target_type?: NotificationTarget
}

export interface UpdateNotificationResponse {
  success: boolean
  data: Notification
}

export interface DeleteNotificationRequest {
  id: number
}

export interface DeleteNotificationResponse {
  success: boolean
}

export interface NotificationFormState {
  title: string
  linkUrl: string
  scheduledDate: Date | undefined
  errors: {
    title?: string
    linkUrl?: string
    scheduledAt?: string
  }
}

export const initialNotificationFormState: NotificationFormState = {
  title: '',
  linkUrl: '',
  scheduledDate: undefined,
  errors: {},
}
