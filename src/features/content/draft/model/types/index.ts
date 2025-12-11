export type NotificationTarget = 'all' | 'follower' | 'member'

export interface AlarmOptions {
  sendAlarm: boolean
  target: NotificationTarget
  titleStrategy: 'content-title' | 'custom'
  customTitle?: string
  body: string
}

export interface PublishOptions {
  visibility: 'public' | 'private' | 'scheduled'
  scheduledAt?: string // yyyy-MM-dd HH:mm:ss
  alarm?: AlarmOptions
}

export interface ContentFormData {
  title: string
  body: string
  categories: string[]
  linkUrl: string
  publishOptions?: PublishOptions
}

export interface ContentDraft {
  id: string // uuid
  data: Partial<ContentFormData>
  savedAt: string // ISO8601
  authorId: number
}
