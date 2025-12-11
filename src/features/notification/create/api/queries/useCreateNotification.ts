import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNotification } from '../api'
import { notificationKeys } from '@/entities/notification'
import type { CreateNotificationRequest, CreateNotificationResponse } from '../../model/types'

export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation<CreateNotificationResponse, Error, CreateNotificationRequest>({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys._def })
    },
  })
}
