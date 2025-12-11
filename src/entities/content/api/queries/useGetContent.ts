import { useQuery } from '@tanstack/react-query'
import { contentKeys } from './queryKey'

export function useGetContent(id: number) {
  return useQuery({
    ...contentKeys.detail(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}
