import { apiClient } from '@/shared/api/client'
import type { ContentListResponse, ContentResponse, ContentListParams, ContentScheduleResponse } from '../../model/types'

export async function getContentList(params: ContentListParams = {}): Promise<ContentListResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.status) searchParams.set('status', params.status)
  if (params.category) searchParams.set('category', params.category)

  const query = searchParams.toString()
  const url = query ? `api/v1/contents?${query}` : 'api/v1/contents'

  return apiClient.get(url).json<ContentListResponse>()
}

export async function getContent(id: number): Promise<ContentResponse> {
  return apiClient.get(`api/v1/contents/${id}`).json<ContentResponse>()
}

export async function getContentSchedule(id: number): Promise<ContentScheduleResponse> {
  return apiClient.get(`api/v1/contents/${id}/schedule`).json<ContentScheduleResponse>()
}
