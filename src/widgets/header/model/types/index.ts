export type HeaderVariant = 'home' | 'content-form' | 'alarm-form'

export interface HeaderProps {
  variant: HeaderVariant
  onBack?: () => void
  onSaveDraft?: () => void
  onPublish?: () => void
  onNewPost?: () => void
  isPublishDisabled?: boolean
  isSavingDraft?: boolean
  isPublishing?: boolean
}
