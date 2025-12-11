import type { Content } from '@/entities/content'

export interface UpdateContentRequest {
  id: number
  title?: string
  body?: string
  category?: string
  linkUrl?: string
}

export interface UpdateContentApiRequest {
  title?: string
  body?: string
  category?: string
  link_url?: string
}

export interface UpdateContentResponse {
  success: boolean
  data: Content
}
