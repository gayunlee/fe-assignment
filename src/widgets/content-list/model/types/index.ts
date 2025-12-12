import type { Content } from '@/entities/content'

export interface ContentListProps {
  className?: string
}

export interface ContentListItemProps {
  content: Content
  index: number
  onClick?: (id: number) => void
  onCreateAlarm?: (id: number) => void
}
