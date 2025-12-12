import type { Content } from '@/entities/content'

export type NotificationTarget = 'all' | 'follower' | 'member'
export type Visibility = 'public' | 'private' | 'scheduled'
export type TitleStrategy = 'content-title' | 'custom'

export interface AlarmOptions {
  sendAlarm: boolean
  target: NotificationTarget
  titleStrategy: TitleStrategy
  customTitle: string
  body: string
}

export interface PublishOptions {
  visibility: Visibility
  scheduledAt?: string // yyyy-MM-dd HH:mm:ss
  alarm: AlarmOptions
}

export interface PublishContentRequest {
  id: number
  status: 'public' | 'private'
}

export interface ScheduleContentRequest {
  id: number
  publishedAt: string // ISO 8601
}

export interface PublishContentResponse {
  success: boolean
  data: Content
}

export interface PublishOptionsState {
  visibility: Visibility
  scheduledDate: Date | null
  sendAlarm: boolean
  alarmTarget: NotificationTarget
  alarmTitleStrategy: TitleStrategy
  alarmCustomTitle: string
  errors: {
    scheduledAt?: string
  }
}

export const initialPublishOptionsState: PublishOptionsState = {
  visibility: 'public',
  scheduledDate: null,
  sendAlarm: false,
  alarmTarget: 'all',
  alarmTitleStrategy: 'content-title',
  alarmCustomTitle: '',
  errors: {},
}
