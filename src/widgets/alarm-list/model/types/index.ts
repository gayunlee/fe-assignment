import type { Notification } from '@/entities/notification'

export interface AlarmListProps {
  className?: string
}

export interface AlarmListItemProps {
  notification: Notification
  index: number
  onClick?: (id: number) => void
}
