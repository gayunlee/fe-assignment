import { apiClient } from '@/shared/api/client'
import type {
  PublishContentRequest,
  ScheduleContentRequest,
  PublishContentResponse,
} from '../../model/types'

export async function publishContent(
  request: PublishContentRequest
): Promise<PublishContentResponse> {
  const { id, status } = request
  return apiClient
    .patch(`api/v1/contents/${id}/status`, { json: { status } })
    .json()
}

export async function scheduleContent(
  request: ScheduleContentRequest
): Promise<PublishContentResponse> {
  const { id, publishedAt } = request
  return apiClient
    .post(`api/v1/contents/${id}/schedule`, { json: { published_at: publishedAt } })
    .json()
}
