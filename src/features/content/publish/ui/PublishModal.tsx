import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { DateTimePicker } from '@/shared/ui/date-time-picker'
import { usePublishOptionsState, type InitialPublishState } from '../model/hooks'
import type { Visibility, NotificationTarget } from '../model/types'

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (options: {
    visibility: Visibility
    scheduledAt?: string
    sendAlarm: boolean
    alarmTarget?: NotificationTarget
    alarmTitle?: string
  }) => void
  contentTitle: string
  isLoading?: boolean
  initialState?: InitialPublishState
}

export function PublishModal({
  isOpen,
  onClose,
  onPublish,
  contentTitle,
  isLoading = false,
  initialState,
}: PublishModalProps) {
  const { state, scheduledAt, showAlarmOptions, alarmTitle, actions } =
    usePublishOptionsState({ contentTitle, initialState })

  const handleSubmit = () => {
    if (!actions.validate()) {
      return
    }

    onPublish({
      visibility: state.visibility,
      scheduledAt: scheduledAt ?? undefined,
      sendAlarm: state.sendAlarm,
      alarmTarget: state.sendAlarm ? state.alarmTarget : undefined,
      alarmTitle: state.sendAlarm ? alarmTitle : undefined,
    })
  }

  const handleClose = () => {
    actions.reset()
    onClose()
  }

  // 오늘 날짜 (과거 날짜 선택 방지)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>발행 옵션</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 공개 여부 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">공개 여부</Label>
            <RadioGroup
              value={state.visibility}
              onValueChange={(value) => actions.setVisibility(value as Visibility)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="font-normal cursor-pointer">
                  공개
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="font-normal cursor-pointer">
                  비공개
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled" className="font-normal cursor-pointer">
                  예약 발행
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 예약 시간 선택 */}
          {state.visibility === 'scheduled' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">예약 시간</Label>
              <DateTimePicker
                value={state.scheduledDate ?? undefined}
                onChange={(date) => actions.setScheduledDate(date ?? null)}
                placeholder="예약 발행 시간을 선택하세요"
                minDate={today}
              />
              {state.errors.scheduledAt && (
                <p className="text-sm text-red-500">{state.errors.scheduledAt}</p>
              )}
            </div>
          )}

          {/* 알람 설정 */}
          {showAlarmOptions && (
            <div className="space-y-4 border-t pt-4">
              <Label className="text-sm font-medium">알람 설정</Label>
              <RadioGroup
                value={state.sendAlarm ? 'send' : 'none'}
                onValueChange={(value) => actions.setSendAlarm(value === 'send')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="send" id="send" />
                  <Label htmlFor="send" className="font-normal cursor-pointer">
                    발송
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="font-normal cursor-pointer">
                    미발송
                  </Label>
                </div>
              </RadioGroup>

              {state.sendAlarm && (
                <div className="space-y-4 pl-4 border-l-2">
                  {/* 대상자 선택 */}
                  <div className="space-y-2">
                    <Label className="text-sm">대상자</Label>
                    <RadioGroup
                      value={state.alarmTarget}
                      onValueChange={(value) =>
                        actions.setAlarmTarget(value as NotificationTarget)
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="all" id="target-all" />
                        <Label htmlFor="target-all" className="font-normal cursor-pointer">
                          전체
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="follower" id="target-follower" />
                        <Label htmlFor="target-follower" className="font-normal cursor-pointer">
                          팔로워
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="member" id="target-member" />
                        <Label htmlFor="target-member" className="font-normal cursor-pointer">
                          멤버십
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 알람 제목 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-content-title"
                        checked={state.alarmTitleStrategy === 'content-title'}
                        onCheckedChange={(checked) =>
                          actions.setAlarmTitleStrategy(checked ? 'content-title' : 'custom')
                        }
                      />
                      <Label htmlFor="use-content-title" className="font-normal cursor-pointer">
                        콘텐츠 제목 사용
                      </Label>
                    </div>
                    <Input
                      placeholder="알람 제목"
                      value={
                        state.alarmTitleStrategy === 'content-title'
                          ? contentTitle
                          : state.alarmCustomTitle
                      }
                      onChange={(e) => actions.setAlarmCustomTitle(e.target.value)}
                      disabled={state.alarmTitleStrategy === 'content-title'}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '발행 중...' : '발행하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
