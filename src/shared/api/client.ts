import ky, { type KyRequest, type KyResponse, type NormalizedOptions } from 'ky'
import {
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  clearTokens,
} from '../lib/utils/token'

const API_BASE_URL = 'http://fe-assignment-api.us-insight.com'

interface RefreshTokenResponse {
  success: boolean
  data: {
    access_token: string
    access_expires_at: string
  }
}

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  try {
    const response = await ky.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
      json: { refresh_token: refreshToken },
    }).json<RefreshTokenResponse>()

    if (response.success && response.data) {
      updateAccessToken(response.data.access_token, response.data.access_expires_at)
      return response.data.access_token
    }
    return null
  } catch {
    clearTokens()
    return null
  }
}

async function handleTokenRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false
    refreshPromise = null
  })

  return refreshPromise
}

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  hooks: {
    beforeRequest: [
      (request: KyRequest) => {
        const token = getAccessToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (
        request: KyRequest,
        _options: NormalizedOptions,
        response: KyResponse
      ): Promise<KyResponse | void> => {
        if (response.status === 401) {
          const newToken = await handleTokenRefresh()

          if (newToken) {
            request.headers.set('Authorization', `Bearer ${newToken}`)
            return ky(request)
          } else {
            clearTokens()
            window.location.href = '/login'
          }
        }
      },
    ],
  },
})
