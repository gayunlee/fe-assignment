import type { User } from '@/entities/user'

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  data: {
    access_token: string
    refresh_token: string
    access_expires_at: string
    refresh_expires_at: string
    user: User
  }
}

export interface RegisterFormState {
  email: string
  password: string
  confirmPassword: string
  errors: {
    email?: string
    password?: string
    confirmPassword?: string
  }
}
