import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetContentList } from '@/entities/content'
import { ContentListItem } from './ContentListItem'
import type { ContentListProps } from '../model/types'
import { cn } from '@/shared/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'public', label: '공개' },
  { value: 'private', label: '비공개' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '일반', label: '일반' },
  { value: '공지', label: '공지' },
  { value: '이벤트', label: '이벤트' },
]

export function ContentList({ className }: ContentListProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const observerRef = useRef<HTMLDivElement>(null)

  const statusParam = searchParams.get('status')
  const categoryParam = searchParams.get('category')

  const status = statusParam === 'public' || statusParam === 'private' ? statusParam : undefined
  const category = categoryParam && categoryParam !== 'all' ? categoryParam : undefined

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetContentList({ status, category })

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

  const handleStatusChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === 'all') {
      newParams.delete('status')
    } else {
      newParams.set('status', value)
    }
    setSearchParams(newParams)
  }

  const handleCategoryChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === 'all') {
      newParams.delete('category')
    } else {
      newParams.set('category', value)
    }
    setSearchParams(newParams)
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
    <div className={cn('', className)}>
      <div className="flex gap-3 mb-4">
        <Select value={statusParam || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryParam || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-16">
                번호
              </th>
              <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-left">
                제목
              </th>
              <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-28">
                공개일자
              </th>
              <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-24">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contents.map((content, index) => (
              <ContentListItem
                key={content.id}
                content={content}
                index={index}
                onClick={handleContentClick}
                onCreateAlarm={handleCreateAlarm}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div ref={observerRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="text-muted-foreground text-sm">더 불러오는 중...</div>
        </div>
      )}
    </div>
  )
}
