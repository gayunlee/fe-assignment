import { createQueryKeys } from '@lukemorales/query-key-factory'
import type { NotificationListParams } from '../../model/types'
import { getNotificationList, getNotification } from '../api'

export const notificationKeys = createQueryKeys('notification', {
  list: (params: NotificationListParams) => ({
    queryKey: [params],
    queryFn: () => getNotificationList(params),
  }),
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => getNotification(id),
  }),
})
