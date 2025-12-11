import { useMutation } from '@tanstack/react-query'
import { login } from '../api'
import { setTokens } from '@/shared/lib/utils/token'
import type { LoginRequest } from '../../model/types'

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
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
