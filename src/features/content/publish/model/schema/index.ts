import { z } from 'zod'

export const publishOptionsSchema = z
  .object({
    visibility: z.enum(['public', 'private', 'scheduled']),
    scheduledAt: z.string().optional(),
    sendAlarm: z.boolean(),
    alarmTarget: z.enum(['all', 'follower', 'member']),
    alarmTitleStrategy: z.enum(['content-title', 'custom']),
    alarmCustomTitle: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.visibility === 'scheduled' && !data.scheduledAt) {
        return false
      }
      return true
    },
    {
      message: '예약 발행 시간을 선택해주세요',
      path: ['scheduledAt'],
    }
  )

export type PublishOptionsFormValues = z.infer<typeof publishOptionsSchema>
