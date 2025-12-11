import { apiClient } from '@/shared/api/client'
import type {
  NotificationListResponse,
  NotificationResponse,
  NotificationListParams,
} from '../../model/types'

export async function getNotificationList(
  params: NotificationListParams = {}
): Promise<NotificationListResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.status) searchParams.set('status', params.status)
  if (params.targetType) searchParams.set('target_type', params.targetType)

  const query = searchParams.toString()
  const url = query ? `api/v1/notifications?${query}` : 'api/v1/notifications'

  return apiClient.get(url).json<NotificationListResponse>()
}

export async function getNotification(id: number): Promise<NotificationResponse> {
  return apiClient.get(`api/v1/notifications/${id}`).json<NotificationResponse>()
}
