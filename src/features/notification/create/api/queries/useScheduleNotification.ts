import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleNotification, type ScheduleNotificationRequest, type ScheduleNotificationResponse } from '../api'
import { notificationKeys } from '@/entities/notification'

export function useScheduleNotification() {
  const queryClient = useQueryClient()

  return useMutation<ScheduleNotificationResponse, Error, ScheduleNotificationRequest>({
    mutationFn: scheduleNotification,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys._def })
      queryClient.invalidateQueries({
        queryKey: notificationKeys.detail(variables.id).queryKey,
      })
    },
  })
}
