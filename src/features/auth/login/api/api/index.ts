import ky from 'ky'
import { API_BASE_URL } from '@/shared/config/constants'
import type { LoginRequest, LoginResponse } from '../../model/types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return ky.post(`${API_BASE_URL}/api/v1/auth/login`, {
    json: data,
  }).json<LoginResponse>()
}
