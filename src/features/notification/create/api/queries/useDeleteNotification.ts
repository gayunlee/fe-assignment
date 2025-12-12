import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNotification } from '../api'
import { notificationKeys } from '@/entities/notification'
import type { DeleteNotificationRequest, DeleteNotificationResponse } from '../../model/types'

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation<DeleteNotificationResponse, Error, DeleteNotificationRequest>({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys._def })
    },
  })
}
