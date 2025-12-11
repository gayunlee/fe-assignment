import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useMemo } from 'react'
import { contentFormSchema, ContentFormValues } from '../schema'
import { VALIDATION } from '@/shared/config/constants'

interface UseContentFormStateOptions {
  defaultValues?: Partial<ContentFormValues>
}

export function useContentFormState(options: UseContentFormStateOptions = {}) {
  const { defaultValues } = options

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      body: defaultValues?.body ?? '',
      categories: defaultValues?.categories ?? [],
      linkUrl: defaultValues?.linkUrl ?? '',
    },
    mode: 'onChange',
  })

  const {
    watch,
    setValue,
    formState: { errors, isValid },
  } = form

  const title = watch('title')
  const body = watch('body')
  const categories = watch('categories')
  const linkUrl = watch('linkUrl')

  const toggleCategory = useCallback(
    (category: string) => {
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
    },
    [categories, setValue]
  )

  const clearLinkUrl = useCallback(() => {
    setValue('linkUrl', '', { shouldValidate: true })
  }, [setValue])

  const titleLength = title.length
  const bodyLength = body.length
  const isTitleMaxReached = titleLength >= VALIDATION.TITLE_MAX_LENGTH
  const isBodyMaxReached = bodyLength >= VALIDATION.CONTENT_MAX_LENGTH

  const formData = useMemo(
    () => ({
      title,
      body,
      categories,
      linkUrl: linkUrl ?? '',
    }),
    [title, body, categories, linkUrl]
  )

  return {
    form,
    state: {
      title,
      body,
      categories,
      linkUrl: linkUrl ?? '',
      titleLength,
      bodyLength,
      isTitleMaxReached,
      isBodyMaxReached,
      isValid,
      errors,
    },
    actions: {
      toggleCategory,
      clearLinkUrl,
    },
    formData,
  }
}
