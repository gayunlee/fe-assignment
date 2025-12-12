import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { Header } from '@/widgets/header'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { useGetContent } from '@/entities/content'
import {
  contentFormSchema,
  type ContentFormValues,
} from '@/features/content/create'
import {
  useDraftState,
  useAutoSave,
  type ContentFormData,
} from '@/features/content/draft'
import {
  PublishModal,
  useContentPublish,
  type Visibility,
  type NotificationTarget,
  type InitialPublishState,
  type ExistingContentState,
} from '@/features/content/publish'
import { VALIDATION } from '@/shared/config/constants'

const CATEGORIES = ['일반', '공지', '이벤트', '프로모션']

export function ContentFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const useDraft = searchParams.get('draft') === 'true'

  const isEditMode = !!id
  const contentId = id ? Number(id) : undefined

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // 수정 모드: 기존 콘텐츠 조회
  const { data: existingContent, isLoading: isLoadingContent } = useGetContent(contentId ?? 0)

  const { draft, save: saveDraft, clear: clearDraft } = useDraftState({
    authorId: 1, // TODO: Get from auth context
    loadExisting: useDraft && !isEditMode,
  })

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: '',
      body: '',
      categories: [],
      linkUrl: '',
    },
    mode: 'onChange',
  })

  const title = watch('title')
  const body = watch('body')
  const categories = watch('categories')
  const linkUrl = watch('linkUrl')

  // 수정 모드: 기존 콘텐츠 데이터 로드
  useEffect(() => {
    if (isEditMode && existingContent && !isInitialized) {
      setValue('title', existingContent.title, { shouldValidate: true })
      setValue('body', existingContent.body, { shouldValidate: true })
      setValue('categories', existingContent.category.split(',').filter(Boolean), { shouldValidate: true })
      setValue('linkUrl', existingContent.linkUrl || '', { shouldValidate: true })
      setIsInitialized(true)
    }
  }, [isEditMode, existingContent, isInitialized, setValue])

  // Load draft data (새 글 작성 시에만)
  useEffect(() => {
    if (!isEditMode && useDraft && draft?.data && !isInitialized) {
      const data = draft.data
      if (data.title) setValue('title', data.title, { shouldValidate: true })
      if (data.body) setValue('body', data.body, { shouldValidate: true })
      if (data.categories) setValue('categories', data.categories, { shouldValidate: true })
      if (data.linkUrl) setValue('linkUrl', data.linkUrl, { shouldValidate: true })
      setIsInitialized(true)
    }
  }, [isEditMode, useDraft, draft, isInitialized, setValue])

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(
      title !== '' || body !== '' || categories.length > 0 || linkUrl !== ''
    )
  }, [title, body, categories, linkUrl])

  const formData: Partial<ContentFormData> = {
    title,
    body,
    categories,
    linkUrl: linkUrl ?? '',
  }

  useAutoSave({
    data: formData,
    onSave: saveDraft,
    enabled: hasUnsavedChanges,
  })

  // 수정 모드: Content status를 ExistingContentState로 변환
  const previousState = useMemo((): ExistingContentState | undefined => {
    if (!isEditMode || !existingContent) {
      return undefined
    }

    const { status, publishedAt } = existingContent

    // private 상태이고 publishedAt이 미래인 경우 → scheduled (예약발행)
    if (status === 'private' && publishedAt) {
      const publishDate = new Date(publishedAt)
      if (publishDate > new Date()) {
        return 'scheduled'
      }
    }

    // public, private, draft 상태
    return status
  }, [isEditMode, existingContent])

  const { execute: publishContentFlow, isPending: isPublishingFlow } = useContentPublish({
    isEditMode,
    contentId,
    previousState,
    // TODO: existingNotification 추가 필요
  })

  // 수정 모드: 기존 콘텐츠의 발행 상태를 PublishModal 초기값으로 변환
  const initialPublishState = useMemo((): InitialPublishState | undefined => {
    if (!isEditMode || !existingContent) {
      return undefined
    }

    const { status, publishedAt } = existingContent

    // private 상태이고 publishedAt이 미래인 경우 → 예약 발행
    if (status === 'private' && publishedAt) {
      const publishDate = new Date(publishedAt)
      if (publishDate > new Date()) {
        return {
          visibility: 'scheduled',
          scheduledAt: publishedAt,
        }
      }
    }

    // public → 공개, private (스케줄 없음) → 비공개
    if (status === 'public') {
      return {
        visibility: 'public',
        scheduledAt: null,
      }
    }

    if (status === 'private') {
      return {
        visibility: 'private',
        scheduledAt: null,
      }
    }

    // 기본값 (draft 상태)
    return undefined
  }, [isEditMode, existingContent])

  const handleCategoryToggle = (category: string) => {
    const current = categories
    if (current.includes(category)) {
      setValue(
        'categories',
        current.filter((c) => c !== category),
        { shouldValidate: true }
      )
    } else if (current.length < VALIDATION.CATEGORY_MAX_COUNT) {
      setValue('categories', [...current, category], { shouldValidate: true })
    }
  }

  const handleClearLink = () => {
    setValue('linkUrl', '', { shouldValidate: true })
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setIsBackConfirmOpen(true)
    } else {
      navigate('/')
    }
  }

  const handleConfirmBack = () => {
    setIsBackConfirmOpen(false)
    navigate('/')
  }

  const handleSaveDraft = useCallback(() => {
    saveDraft(formData)
  }, [saveDraft, formData])

  const handlePublishClick = () => {
    setIsPublishModalOpen(true)
  }

  const handlePublish = async (options: {
    visibility: Visibility
    scheduledAt?: string
    sendAlarm: boolean
    alarmTarget?: NotificationTarget
    alarmTitle?: string
    alarmBody?: string
  }) => {
    if (!isValid) return

    try {
      await publishContentFlow(
        {
          title,
          body,
          category: categories.join(','),
          linkUrl: linkUrl || undefined,
        },
        options
      )

      // 완료 처리
      if (!isEditMode) {
        clearDraft()
      }
      setIsPublishModalOpen(false)
      navigate('/')
    } catch (error) {
      console.error('발행 중 오류 발생:', error)
    }
  }

  const isUrlValid = (url: string) => {
    if (!url) return true
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // 수정 모드에서 콘텐츠 로딩 중
  if (isEditMode && isLoadingContent) {
    return (
      <div className="min-h-screen bg-background">
        <Header variant="content-form" onBack={() => navigate('/')} />
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">콘텐츠를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        variant="content-form"
        onBack={handleBack}
        onSaveDraft={isEditMode ? undefined : handleSaveDraft}
        onPublish={handlePublishClick}
        isPublishDisabled={!isValid}
        isPublishing={isPublishingFlow}
      />

      <main className="container max-w-2xl px-4 py-6">
        <form className="space-y-6">
          {/* 카테고리 선택 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              카테고리 <span className="text-red-500">*</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({categories.length}/{VALIDATION.CATEGORY_MAX_COUNT})
              </span>
            </Label>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    disabled={
                      !categories.includes(category) &&
                      categories.length >= VALIDATION.CATEGORY_MAX_COUNT
                    }
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-sm text-red-500">{errors.categories.message}</p>
            )}
          </div>

          {/* 제목 입력 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title" className="text-sm font-medium">
                제목 <span className="text-red-500">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {title.length}/{VALIDATION.TITLE_MAX_LENGTH}
              </span>
            </div>
            <Input
              id="title"
              placeholder="제목을 입력해주세요. (최대 50자)"
              maxLength={VALIDATION.TITLE_MAX_LENGTH}
              {...register('title')}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 내용 입력 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body" className="text-sm font-medium">
                내용 <span className="text-red-500">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {body.length}/{VALIDATION.CONTENT_MAX_LENGTH}
              </span>
            </div>
            <Textarea
              id="body"
              placeholder="내용을 입력해주세요 (최대 500자)"
              maxLength={VALIDATION.CONTENT_MAX_LENGTH}
              rows={8}
              {...register('body')}
              aria-invalid={!!errors.body}
            />
            {errors.body && (
              <p className="text-sm text-red-500">{errors.body.message}</p>
            )}
          </div>

          {/* 링크 입력 */}
          <div className="space-y-2">
            <Label htmlFor="linkUrl" className="text-sm font-medium">
              링크
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="linkUrl"
                  placeholder="https://example.com"
                  {...register('linkUrl')}
                  aria-invalid={!!errors.linkUrl}
                />
                {linkUrl && (
                  <button
                    type="button"
                    onClick={handleClearLink}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={!linkUrl || !isUrlValid(linkUrl ?? '')}
              >
                삽입
              </Button>
            </div>
            {errors.linkUrl && (
              <p className="text-sm text-red-500">{errors.linkUrl.message}</p>
            )}
          </div>
        </form>
      </main>

      {/* 발행 모달 */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublish}
        contentTitle={title}
        isLoading={isPublishingFlow}
        initialState={initialPublishState}
      />

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
