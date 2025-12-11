import type { Notification } from '@/entities/notification'

export interface ScheduleNotificationRequest {
  id: number
  scheduledAt: string // ISO 8601
}

export interface ScheduleNotificationApiRequest {
  scheduled_at: string
}

export interface ScheduleNotificationResponse {
  success: boolean
  data: Notification
}
