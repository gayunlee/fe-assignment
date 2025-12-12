import { apiClient } from '@/shared/api/client'
import type {
  NotificationListResponse,
  NotificationListApiResponse,
  NotificationResponse,
  NotificationApiResponseWrapper,
  NotificationListParams,
} from '../../model/types'
import { mapNotificationFromApi } from '../../model/types'

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

  const response = await apiClient.get(url).json<NotificationListApiResponse>()

  return {
    success: response.success,
    data: {
      notifications: response.data.notifications.map(mapNotificationFromApi),
      page: response.data.page,
      limit: response.data.limit,
      total: response.data.total,
    },
  }
}

export async function getNotification(id: number): Promise<NotificationResponse> {
  const response = await apiClient.get(`api/v1/notifications/${id}`).json<NotificationApiResponseWrapper>()

  return {
    success: response.success,
    data: mapNotificationFromApi(response.data),
  }
}
