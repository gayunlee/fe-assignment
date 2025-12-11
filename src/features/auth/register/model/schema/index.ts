import { z } from 'zod'
import { VALIDATION } from '@/shared/config/constants'

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `비밀번호는 ${VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다`
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
