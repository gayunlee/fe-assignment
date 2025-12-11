import type { ContentListItemProps } from '../model/types'

export function ContentListItem({ content, onClick }: ContentListItemProps) {
  const handleClick = () => {
    onClick?.(content.id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <article
      className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
              {content.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {content.status === 'public' ? '공개' : '비공개'}
            </span>
          </div>
          <h3 className="font-medium text-sm line-clamp-1">{content.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {content.body}
          </p>
        </div>
        <div className="flex flex-col items-end text-xs text-muted-foreground">
          <span>{formatDate(content.createdAt)}</span>
          <span className="mt-1">{content.user.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <span>조회 {content.stats.viewCount}</span>
        <span>좋아요 {content.stats.likeCount}</span>
        <span>댓글 {content.stats.commentCount}</span>
      </div>
    </article>
  )
}
