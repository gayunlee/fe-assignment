import { useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
import { DateTimePicker } from '@/shared/ui/date-time-picker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import {
  useNotificationFormState,
  useCreateNotification,
  useUpdateNotification,
  useScheduleNotification,
  type NotificationFormInitialValues,
} from '@/features/notification/create'
import { useGetContent, type Content } from '@/entities/content'
import { useGetNotification, type NotificationTarget } from '@/entities/notification'

interface AlarmFormProps {
  isEditMode: boolean
  notificationId: number
  contentId: number
  linkedContent: Content | undefined
  initialValues?: NotificationFormInitialValues
}

function AlarmForm({
  isEditMode,
  notificationId,
  contentId,
  linkedContent,
  initialValues,
}: AlarmFormProps) {
  const navigate = useNavigate()
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false)

  const { state, scheduledAt, isValid, hasChanges, actions } =
    useNotificationFormState(initialValues)
  const { mutate: createNotification, isPending: isCreating } = useCreateNotification()
  const { mutate: updateNotification, isPending: isUpdating } = useUpdateNotification()
  const { mutate: scheduleNotification, isPending: isScheduling } = useScheduleNotification()

  const isPending = isCreating || isUpdating || isScheduling

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

  const handlePublish = () => {
    if (!actions.validate()) return
    if (!scheduledAt) return
    if (!state.title) return

    if (isEditMode) {
      updateNotification(
        {
          id: notificationId,
          title: state.title,
          contentId,
          targetType: state.targetType,
        },
        {
          onSuccess: () => {
            // 스케줄 수정 요청
            scheduleNotification(
              {
                id: notificationId,
                scheduledAt,
              },
              {
                onSuccess: () => {
                  navigate('/')
                },
              }
            )
          },
        }
      )
    } else {
      createNotification(
        {
          title: state.title,
          contentId,
          targetType: state.targetType,
          scheduledAt,
        },
        {
          onSuccess: () => {
            navigate('/')
          },
        }
      )
    }
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

          {/* 대상 선택 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              발송 대상 <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={state.targetType}
              onValueChange={(value) => actions.setTargetType(value as NotificationTarget)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="target-all" />
                <Label htmlFor="target-all" className="font-normal cursor-pointer">
                  전체
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="follower" id="target-follower" />
                <Label htmlFor="target-follower" className="font-normal cursor-pointer">
                  팔로워
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="target-member" />
                <Label htmlFor="target-member" className="font-normal cursor-pointer">
                  멤버십
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 연결된 콘텐츠 */}
          {linkedContent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">연결된 콘텐츠</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">{linkedContent.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {linkedContent.body}
                </p>
              </div>
            </div>
          )}
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

export function AlarmFormPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const contentIdParam = searchParams.get('contentId')

  const isEditMode = !!id
  const notificationId = id ? Number(id) : 0

  // 수정 모드일 때 알림 데이터 조회
  const { data: notification, isLoading: isNotificationLoading } =
    useGetNotification(notificationId)

  // contentId 결정: 수정 모드면 알림의 contentId, 신규 모드면 쿼리 파라미터
  const contentId = isEditMode
    ? notification?.contentId
    : contentIdParam
      ? Number(contentIdParam)
      : undefined

  // contentId가 있으면 해당 콘텐츠 정보 조회
  const { data: linkedContent } = useGetContent(contentId ?? 0)

  // 수정 모드에서 데이터 로딩 중
  if (isEditMode && isNotificationLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    )
  }

  // 수정 모드인데 알림을 찾지 못함
  if (isEditMode && !notification) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">알림을 찾을 수 없습니다.</div>
      </div>
    )
  }

  // 신규 모드인데 contentId가 없음
  if (!isEditMode && !contentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">콘텐츠 ID가 필요합니다.</div>
      </div>
    )
  }

  // 초기값 설정
  const initialValues: NotificationFormInitialValues | undefined = isEditMode && notification
    ? {
        title: notification.title,
        targetType: notification.targetType,
        scheduledDate: notification.scheduledAt ? new Date(notification.scheduledAt) : undefined,
      }
    : undefined

  return (
    <AlarmForm
      key={isEditMode ? notificationId : 'new'}
      isEditMode={isEditMode}
      notificationId={notificationId}
      contentId={contentId!}
      linkedContent={linkedContent}
      initialValues={initialValues}
    />
  )
}
