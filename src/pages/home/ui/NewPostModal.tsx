import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { loadDraft, hasDraft as checkHasDraft } from '@/features/content/draft'

interface NewPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectContent: (useDraft: boolean) => void
  onSelectAlarm: () => void
}

export function NewPostModal({ isOpen, onClose, onSelectContent, onSelectAlarm }: NewPostModalProps) {
  const hasDraft = checkHasDraft()
  const draft = hasDraft ? loadDraft() : null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>새글쓰기</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-3 px-4"
            onClick={() => onSelectContent(false)}
          >
            <div className="text-left">
              <div className="font-medium">새 글 쓰기</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                새로운 콘텐츠를 작성합니다
              </div>
            </div>
          </Button>

          {hasDraft && draft && (
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => onSelectContent(true)}
            >
              <div className="text-left">
                <div className="font-medium">임시저장된 콘텐츠 쓰기</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  마지막 저장: {formatDate(draft.savedAt)}
                </div>
              </div>
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start h-auto py-3 px-4"
            onClick={onSelectAlarm}
          >
            <div className="text-left">
              <div className="font-medium">새 알람 쓰기</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                새로운 알람을 작성합니다
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
