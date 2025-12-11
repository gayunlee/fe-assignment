import { apiClient } from '@/shared/api/client'
import type {
  CreateNotificationRequest,
  CreateNotificationApiRequest,
  CreateNotificationResponse,
} from '../../model/types'

export async function createNotification(
  request: CreateNotificationRequest
): Promise<CreateNotificationResponse> {
  const apiRequest: CreateNotificationApiRequest = {
    title: request.title,
    content_id: request.contentId,
    target_type: request.targetType,
    scheduled_at: request.scheduledAt,
  }

  return apiClient.post('api/v1/notifications', { json: apiRequest }).json()
}
