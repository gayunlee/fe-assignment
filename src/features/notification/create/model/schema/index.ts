import { z } from 'zod'

export const notificationFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  linkUrl: z
    .string()
    .min(1, '링크를 입력해주세요')
    .refine(
      (val) => {
        try {
          new URL(val)
          return true
        } catch {
          return false
        }
      },
      '올바른 URL 형식이 아닙니다'
    ),
  scheduledAt: z.string().min(1, '발송 시간을 선택해주세요'),
})

export type NotificationFormValues = z.infer<typeof notificationFormSchema>
