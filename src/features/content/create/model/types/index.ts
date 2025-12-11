import type { Content } from '@/entities/content'

export interface CreateContentRequest {
  title: string
  body: string
  category: string
  linkUrl?: string
}

export interface CreateContentApiRequest {
  title: string
  body: string
  category: string
  link_url?: string
}

export interface CreateContentResponse {
  success: boolean
  data: Content
}

export interface ContentFormState {
  title: string
  body: string
  categories: string[]
  linkUrl: string
  errors: {
    title?: string
    body?: string
    categories?: string
    linkUrl?: string
  }
}
