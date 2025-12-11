import { useInfiniteQuery } from '@tanstack/react-query'
import { notificationKeys } from './queryKey'
import { getNotificationList } from '../api'
import type { NotificationTarget } from '../../model/types'
import { PAGINATION } from '@/shared/config/constants'

interface UseGetNotificationListParams {
  status?: 'public' | 'private'
  targetType?: NotificationTarget
}

export function useGetNotificationList(params: UseGetNotificationListParams = {}) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list({ ...params, limit: PAGINATION.DEFAULT_LIMIT }).queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getNotificationList({
        ...params,
        page: pageParam,
        limit: PAGINATION.DEFAULT_LIMIT,
      }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.data
      const totalPages = Math.ceil(total / limit)
      return page < totalPages ? page + 1 : undefined
    },
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages.flatMap((page) => page.data.notifications),
      pageParams: data.pageParams,
    }),
  })
}
