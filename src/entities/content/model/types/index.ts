import type { UserSummary } from '@/entities/user'

export interface ContentStats {
  viewCount: number
  likeCount: number
  commentCount: number
}

export interface Content {
  id: number
  title: string
  body: string
  category: string
  linkUrl: string | null
  status: 'public' | 'private' | 'draft'
  userId: number
  user: UserSummary
  stats: ContentStats
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface ContentListResponse {
  success: boolean
  data: {
    contents: Content[]
    page: number
    limit: number
    total: number
  }
}

export interface ContentResponse {
  success: boolean
  data: Content
}

export interface ContentListParams {
  page?: number
  limit?: number
  status?: 'public' | 'private'
  category?: string
}
