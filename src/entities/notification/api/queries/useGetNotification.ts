import { useQuery } from '@tanstack/react-query'
import { notificationKeys } from './queryKey'

export function useGetNotification(id: number) {
  return useQuery({
    ...notificationKeys.detail(id),
    enabled: id > 0,
    select: (data) => data.data,
  })
}
