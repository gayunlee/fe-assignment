import type { AuthTokens } from '../../model/types/auth'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const ACCESS_EXPIRES_AT_KEY = 'access_expires_at'
const REFRESH_EXPIRES_AT_KEY = 'refresh_expires_at'

export function getTokens(): AuthTokens | null {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  const accessExpiresAt = localStorage.getItem(ACCESS_EXPIRES_AT_KEY)
  const refreshExpiresAt = localStorage.getItem(REFRESH_EXPIRES_AT_KEY)

  if (!accessToken || !refreshToken || !accessExpiresAt || !refreshExpiresAt) {
    return null
  }

  return {
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  localStorage.setItem(ACCESS_EXPIRES_AT_KEY, tokens.accessExpiresAt)
  localStorage.setItem(REFRESH_EXPIRES_AT_KEY, tokens.refreshExpiresAt)
}

export function updateAccessToken(accessToken: string, accessExpiresAt: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(ACCESS_EXPIRES_AT_KEY, accessExpiresAt)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(ACCESS_EXPIRES_AT_KEY)
  localStorage.removeItem(REFRESH_EXPIRES_AT_KEY)
}

export function isAccessTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(ACCESS_EXPIRES_AT_KEY)
  if (!expiresAt) return true

  const expiryDate = new Date(expiresAt)
  const now = new Date()
  return now >= expiryDate
}

export function isRefreshTokenExpired(): boolean {
  const expiresAt = localStorage.getItem(REFRESH_EXPIRES_AT_KEY)
  if (!expiresAt) return true

  const expiryDate = new Date(expiresAt)
  const now = new Date()
  return now >= expiryDate
}
