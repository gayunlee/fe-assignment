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

export interface NotificationFormState {
  title: string
  linkUrl: string
  scheduledYear: string
  scheduledMonth: string
  scheduledDay: string
  scheduledHour: string
  scheduledMinute: string
  errors: {
    title?: string
    linkUrl?: string
    scheduledAt?: string
  }
}

export const initialNotificationFormState: NotificationFormState = {
  title: '',
  linkUrl: '',
  scheduledYear: '',
  scheduledMonth: '',
  scheduledDay: '',
  scheduledHour: '',
  scheduledMinute: '',
  errors: {},
}
