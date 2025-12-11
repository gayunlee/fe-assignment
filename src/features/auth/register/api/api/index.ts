import ky from 'ky'
import { API_BASE_URL } from '@/shared/config/constants'
import type { RegisterRequest, RegisterResponse } from '../../model/types'

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return ky.post(`${API_BASE_URL}/api/v1/auth/register`, {
    json: data,
  }).json<RegisterResponse>()
}
