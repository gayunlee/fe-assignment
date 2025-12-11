import type { Content } from '@/entities/content'

export interface ContentListProps {
  category?: string
}

export interface ContentListItemProps {
  content: Content
  onClick?: (id: number) => void
}
