import { z } from 'zod'
import { VALIDATION } from '@/shared/config/constants'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `비밀번호는 ${VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다`),
})

export type LoginFormValues = z.infer<typeof loginSchema>
