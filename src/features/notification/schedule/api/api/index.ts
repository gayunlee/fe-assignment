import { apiClient } from '@/shared/api/client'
import type {
  ScheduleNotificationRequest,
  ScheduleNotificationApiRequest,
  ScheduleNotificationResponse,
} from '../../model/types'

export async function scheduleNotification(
  request: ScheduleNotificationRequest
): Promise<ScheduleNotificationResponse> {
  const { id, scheduledAt } = request
  const apiRequest: ScheduleNotificationApiRequest = {
    scheduled_at: scheduledAt,
  }

  return apiClient.post(`api/v1/notifications/${id}/schedule`, { json: apiRequest }).json()
}
