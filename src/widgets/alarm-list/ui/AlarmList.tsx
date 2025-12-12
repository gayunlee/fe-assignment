import { useNavigate } from 'react-router-dom'
import { useGetNotificationList, type Notification } from '@/entities/notification'
import { AlarmListItem } from './AlarmListItem'
import type { AlarmListProps } from '../model/types'
import { cn } from '@/shared/lib/utils'

export function AlarmList({ className }: AlarmListProps) {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useGetNotificationList({})

  const handleNotificationClick = (id: number) => {
    navigate(`/alarm/${id}/edit`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-red-500">
          오류가 발생했습니다: {error?.message || '알 수 없는 오류'}
        </div>
      </div>
    )
  }

  const notifications: Notification[] = data?.pages ?? []

  if (notifications.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">알람이 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[600px]">
        <thead className="bg-muted/50">
          <tr>
            <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-16">
              번호
            </th>
            <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-left">
              제목
            </th>
            <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-24">
              성공
            </th>
            <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-24">
              실패
            </th>
            <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-40">
              발송 날짜
            </th>
            <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-24">
              상태
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {notifications.map((notification, index) => (
            <AlarmListItem
              key={notification.id}
              notification={notification}
              index={index}
              onClick={handleNotificationClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
