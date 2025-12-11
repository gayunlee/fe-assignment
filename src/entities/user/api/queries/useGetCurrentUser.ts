import { useQuery } from '@tanstack/react-query'
import { userKeys } from './queryKey'

export function useGetCurrentUser() {
  return useQuery({
    ...userKeys.me,
    select: (data) => data.data,
  })
}
