import type { User } from '@/entities/user'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    access_token: string
    refresh_token: string
    access_expires_at: string
    refresh_expires_at: string
    user: User
  }
}

export interface LoginFormState {
  email: string
  password: string
  errors: {
    email?: string
    password?: string
  }
}
