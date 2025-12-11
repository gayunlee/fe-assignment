import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { HeaderProps } from '../model/types'

export function Header({
  variant,
  onBack,
  onSaveDraft,
  onPublish,
  onNewPost,
  isPublishDisabled = false,
  isSavingDraft = false,
  isPublishing = false,
}: HeaderProps) {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showBackButton = variant === 'content-form' || variant === 'alarm-form'
  const showSaveDraftButton = variant === 'content-form'
  const showPublishButton = variant === 'content-form' || variant === 'alarm-form'
  const showNewPostButton = variant === 'home'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {showBackButton && onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="뒤로가기">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            콘텐츠 에디터
          </button>
        </div>

        <div className="flex items-center gap-2">
          {showSaveDraftButton && onSaveDraft && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              disabled={isSavingDraft}
            >
              {isSavingDraft ? '저장 중...' : '임시저장'}
            </Button>
          )}

          {showPublishButton && onPublish && (
            <Button
              size="sm"
              onClick={onPublish}
              disabled={isPublishDisabled || isPublishing}
            >
              {isPublishing ? '발행 중...' : '발행하기'}
            </Button>
          )}

          {showNewPostButton && onNewPost && (
            <Button size="sm" onClick={onNewPost}>
              <Plus className="h-4 w-4 mr-1" />
              새글쓰기
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
