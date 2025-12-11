import { createQueryKeys } from '@lukemorales/query-key-factory'
import { getCurrentUser } from '../api'

export const userKeys = createQueryKeys('user', {
  me: {
    queryKey: null,
    queryFn: getCurrentUser,
  },
})
