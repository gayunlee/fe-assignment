import { createQueryKeys } from '@lukemorales/query-key-factory'
import type { ContentListParams } from '../../model/types'
import { getContentList, getContent } from '../api'

export const contentKeys = createQueryKeys('content', {
  list: (params: ContentListParams) => ({
    queryKey: [params],
    queryFn: () => getContentList(params),
  }),
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => getContent(id),
  }),
})
