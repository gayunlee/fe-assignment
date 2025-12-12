import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetContentList } from '@/entities/content'
import { ContentListItem } from './ContentListItem'
import type { ContentListProps } from '../model/types'

export function ContentList({ category }: ContentListProps) {
  const navigate = useNavigate()
  const observerRef = useRef<HTMLDivElement>(null)
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetContentList({ category: category || undefined })

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = observerRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [handleObserver])

  const handleContentClick = (id: number) => {
    navigate(`/content/${id}/edit`)
  }

  const handleCreateAlarm = (contentId: number) => {
    navigate(`/alarm/new?contentId=${contentId}`)
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

  const contents = data?.pages ?? []

  if (contents.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">콘텐츠가 없습니다.</div>
      </div>
    )
  }

  return (
    <div>
      {contents.map((content) => (
        <ContentListItem
          key={content.id}
          content={content}
          onClick={handleContentClick}
          onCreateAlarm={handleCreateAlarm}
        />
      ))}
      <div ref={observerRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="text-muted-foreground text-sm">더 불러오는 중...</div>
        </div>
      )}
    </div>
  )
}
