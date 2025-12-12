import { apiClient } from '@/shared/api/client'
import type {
  CreateNotificationRequest,
  CreateNotificationApiRequest,
  CreateNotificationResponse,
  UpdateNotificationRequest,
  UpdateNotificationApiRequest,
  UpdateNotificationResponse,
  DeleteNotificationRequest,
  DeleteNotificationResponse,
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

export async function updateNotification(
  request: UpdateNotificationRequest
): Promise<UpdateNotificationResponse> {
  const { id, ...data } = request
  const apiRequest: UpdateNotificationApiRequest = {}

  if (data.title !== undefined) apiRequest.title = data.title
  if (data.contentId !== undefined) apiRequest.content_id = data.contentId
  if (data.targetType !== undefined) apiRequest.target_type = data.targetType

  return apiClient.put(`api/v1/notifications/${id}`, { json: apiRequest }).json()
}

export async function deleteNotification(
  request: DeleteNotificationRequest
): Promise<DeleteNotificationResponse> {
  return apiClient.delete(`api/v1/notifications/${request.id}`).json()
}
