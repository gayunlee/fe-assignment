import { apiClient } from '@/shared/api/client'
import type {
  CreateContentRequest,
  CreateContentApiRequest,
  CreateContentResponse,
} from '../../model/types'

export async function createContent(
  request: CreateContentRequest
): Promise<CreateContentResponse> {
  const apiRequest: CreateContentApiRequest = {
    title: request.title,
    body: request.body,
    category: request.category,
    link_url: request.linkUrl,
  }

  return apiClient.post('api/v1/contents', { json: apiRequest }).json()
}
