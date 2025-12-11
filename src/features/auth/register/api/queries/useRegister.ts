import { useMutation } from '@tanstack/react-query'
import { register } from '../api'
import { setTokens } from '@/shared/lib/utils/token'
import type { RegisterRequest } from '../../model/types'

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setTokens({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          accessExpiresAt: response.data.access_expires_at,
          refreshExpiresAt: response.data.refresh_expires_at,
        })
      }
    },
  })
}
