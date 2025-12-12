import { useQuery } from '@tanstack/react-query'
import { contentKeys } from './queryKey'

export function useGetContentSchedule(id: number) {
  return useQuery({
    ...contentKeys.schedule(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}
