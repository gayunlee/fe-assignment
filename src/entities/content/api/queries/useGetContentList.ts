import { useInfiniteQuery } from '@tanstack/react-query'
import { contentKeys } from './queryKey'
import { getContentList } from '../api'
import { PAGINATION } from '@/shared/config/constants'

interface UseGetContentListParams {
  status?: 'public' | 'private'
  category?: string
}

export function useGetContentList(params: UseGetContentListParams = {}) {
  return useInfiniteQuery({
    queryKey: contentKeys.list({ ...params, limit: PAGINATION.DEFAULT_LIMIT }).queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getContentList({
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
      pages: data.pages.flatMap((page) => page.data.contents),
      pageParams: data.pageParams,
    }),
  })
}
