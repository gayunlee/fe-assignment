import { apiClient } from '@/shared/api/client'
import type { UserResponse } from '../../model/types'

export async function getCurrentUser(): Promise<UserResponse> {
  return apiClient.get('api/v1/users/me').json<UserResponse>()
}
