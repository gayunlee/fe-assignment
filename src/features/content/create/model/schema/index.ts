import { z } from 'zod'
import { VALIDATION } from '@/shared/config/constants'

export const contentFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(VALIDATION.TITLE_MAX_LENGTH, `제목은 ${VALIDATION.TITLE_MAX_LENGTH}자 이하로 입력해주세요`),
  body: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(VALIDATION.CONTENT_MAX_LENGTH, `내용은 ${VALIDATION.CONTENT_MAX_LENGTH}자 이하로 입력해주세요`),
  categories: z
    .array(z.string())
    .min(VALIDATION.CATEGORY_MIN_COUNT, `카테고리를 ${VALIDATION.CATEGORY_MIN_COUNT}개 이상 선택해주세요`)
    .max(VALIDATION.CATEGORY_MAX_COUNT, `카테고리는 ${VALIDATION.CATEGORY_MAX_COUNT}개까지 선택 가능합니다`),
  linkUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || isValidUrl(val),
      '올바른 URL 형식이 아닙니다'
    ),
})

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export type ContentFormValues = z.infer<typeof contentFormSchema>

export function validateUrl(url: string): boolean {
  if (!url) return true
  return isValidUrl(url)
}
