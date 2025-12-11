import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleNotification } from '../api'
import { notificationKeys } from '@/entities/notification'
import type { ScheduleNotificationRequest, ScheduleNotificationResponse } from '../../model/types'

export function useScheduleNotification() {
  const queryClient = useQueryClient()

  return useMutation<ScheduleNotificationResponse, Error, ScheduleNotificationRequest>({
    mutationFn: scheduleNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys._def })
    },
  })
}
