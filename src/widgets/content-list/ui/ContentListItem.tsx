import { Bell } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { ContentListItemProps } from '../model/types'

export function ContentListItem({
  content,
  index,
  onClick,
  onCreateAlarm,
}: ContentListItemProps) {
  const handleClick = () => {
    onClick?.(content.id)
  }

  const handleCreateAlarm = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCreateAlarm?.(content.id)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getStatusLabel = (status: 'public' | 'private') => {
    return status === 'public' ? '공개' : '비공개'
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
        <div className="flex items-center justify-between">
          <span className="line-clamp-1">{content.title}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateAlarm}
            className="h-6 text-xs shrink-0"
          >
            <Bell className="h-3 w-3 mr-1" />
            푸시알림
          </Button>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-center text-muted-foreground">
        {formatDate(content.publishedAt)}
      </td>
      <td className="py-3 px-4 text-sm text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            content.status === 'public'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {getStatusLabel(content.status)}
        </span>
      </td>
    </tr>
  )
}
