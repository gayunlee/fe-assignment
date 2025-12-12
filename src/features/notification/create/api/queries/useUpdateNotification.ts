import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNotification } from '../api'
import { notificationKeys } from '@/entities/notification'
import type { UpdateNotificationRequest, UpdateNotificationResponse } from '../../model/types'

export function useUpdateNotification() {
  const queryClient = useQueryClient()

  return useMutation<UpdateNotificationResponse, Error, UpdateNotificationRequest>({
    mutationFn: updateNotification,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys._def })
      queryClient.invalidateQueries({
        queryKey: notificationKeys.detail(variables.id).queryKey,
      })
    },
  })
}
