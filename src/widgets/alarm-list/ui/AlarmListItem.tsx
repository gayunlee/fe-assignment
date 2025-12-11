import type { AlarmListItemProps } from '../model/types'

export function AlarmListItem({ notification, index, onClick }: AlarmListItemProps) {
  const handleClick = () => {
    onClick?.(notification.id)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\. /g, '.').replace(' ', ' ')
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return '발송완료'
      case 'scheduled':
        return '예약됨'
      case 'draft':
        return '임시저장'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600 bg-green-50'
      case 'scheduled':
        return 'text-blue-600 bg-blue-50'
      case 'draft':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <tr
      className="hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <td className="py-3 px-4 text-sm text-center text-muted-foreground">
        {index + 1}
      </td>
      <td className="py-3 px-4 text-sm">
        <span className="line-clamp-1">{notification.title}</span>
      </td>
      <td className="py-3 px-4 text-sm text-center text-green-600">
        {notification.stats.successCount}
      </td>
      <td className="py-3 px-4 text-sm text-center text-red-600">
        {notification.stats.failureCount}
      </td>
      <td className="py-3 px-4 text-sm text-center text-muted-foreground">
        {formatDate(notification.sentAt || notification.scheduledAt)}
      </td>
      <td className="py-3 px-4 text-sm text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(notification.status)}`}
        >
          {getStatusLabel(notification.status)}
        </span>
      </td>
    </tr>
  )
}
