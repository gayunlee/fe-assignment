import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { DateTimePicker } from '@/shared/ui/date-time-picker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { useNotificationFormState } from '@/features/notification/create'
import { useCreateNotification } from '@/features/notification/create'

export function AlarmFormPage() {
  const navigate = useNavigate()
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false)
  const [linkInserted, setLinkInserted] = useState(false)

  const { state, scheduledAt, isValid, hasChanges, actions } = useNotificationFormState()
  const { mutate: createNotification, isPending } = useCreateNotification()

  const isUrlValid = useMemo(() => {
    if (!state.linkUrl) return false
    try {
      new URL(state.linkUrl)
      return true
    } catch {
      return false
    }
  }, [state.linkUrl])

  const handleBack = () => {
    if (hasChanges) {
      setIsBackConfirmOpen(true)
    } else {
      navigate('/')
    }
  }

  const handleConfirmBack = () => {
    setIsBackConfirmOpen(false)
    navigate('/')
  }

  const handleInsertLink = () => {
    if (isUrlValid) {
      setLinkInserted(true)
    }
  }

  const handlePublish = () => {
    if (!actions.validate() || !scheduledAt) return

    createNotification(
      {
        title: state.title,
        contentId: 1, // TODO: Get from selected content or link
        targetType: 'all',
        scheduledAt,
      },
      {
        onSuccess: () => {
          navigate('/')
        },
      }
    )
  }

  // 최소 날짜는 현재 시간
  const minDate = new Date()

  return (
    <div className="min-h-screen bg-background">
      <Header
        variant="alarm-form"
        onBack={handleBack}
        onPublish={handlePublish}
        isPublishDisabled={!isValid}
        isPublishing={isPending}
      />

      <main className="container max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {/* 제목 입력 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="알람 제목을 입력해주세요"
              value={state.title}
              onChange={(e) => actions.setTitle(e.target.value)}
              aria-invalid={!!state.errors.title}
            />
            {state.errors.title && (
              <p className="text-sm text-red-500">{state.errors.title}</p>
            )}
          </div>

          {/* 시간 선택 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              발송 시간 <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              value={state.scheduledDate}
              onChange={actions.setScheduledDate}
              placeholder="발송 시간을 선택하세요"
              minDate={minDate}
            />
            {state.errors.scheduledAt && (
              <p className="text-sm text-red-500">{state.errors.scheduledAt}</p>
            )}
          </div>

          {/* 링크 입력 */}
          <div className="space-y-2">
            <Label htmlFor="linkUrl" className="text-sm font-medium">
              링크 <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="linkUrl"
                  placeholder="https://example.com"
                  value={state.linkUrl}
                  onChange={(e) => {
                    actions.setLinkUrl(e.target.value)
                    setLinkInserted(false)
                  }}
                  aria-invalid={!!state.errors.linkUrl}
                />
                {state.linkUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      actions.clearLinkUrl()
                      setLinkInserted(false)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={!isUrlValid}
                onClick={handleInsertLink}
              >
                삽입
              </Button>
            </div>
            {state.errors.linkUrl && (
              <p className="text-sm text-red-500">{state.errors.linkUrl}</p>
            )}
            {linkInserted && isUrlValid && (
              <div className="p-3 bg-muted rounded-md">
                <a
                  href={state.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {state.linkUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 뒤로가기 확인 모달 */}
      <Dialog open={isBackConfirmOpen} onOpenChange={setIsBackConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>작성을 종료하시겠습니까?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            작성 중인 내용이 저장되지 않을 수 있습니다.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsBackConfirmOpen(false)}>
              취소
            </Button>
            <Button onClick={handleConfirmBack}>종료</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
