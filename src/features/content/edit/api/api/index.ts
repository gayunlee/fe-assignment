import { apiClient } from '@/shared/api/client'
import type {
  UpdateContentRequest,
  UpdateContentApiRequest,
  UpdateContentResponse,
} from '../../model/types'

export async function updateContent(
  request: UpdateContentRequest
): Promise<UpdateContentResponse> {
  const { id, ...data } = request
  const apiRequest: UpdateContentApiRequest = {
    title: data.title,
    body: data.body,
    category: data.category,
    link_url: data.linkUrl,
  }

  return apiClient.put(`api/v1/contents/${id}`, { json: apiRequest }).json()
}
