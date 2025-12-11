export const API_BASE_URL = 'http://fe-assignment-api.us-insight.com'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_EXPIRES_AT: 'access_expires_at',
  REFRESH_EXPIRES_AT: 'refresh_expires_at',
  CONTENT_DRAFT: 'content_draft',
} as const

export const VALIDATION = {
  TITLE_MAX_LENGTH: 50,
  CONTENT_MAX_LENGTH: 500,
  PASSWORD_MIN_LENGTH: 6,
  CATEGORY_MIN_COUNT: 1,
  CATEGORY_MAX_COUNT: 3,
} as const

export const PAGINATION = {
  DEFAULT_LIMIT: 5,
} as const

export const AUTO_SAVE_INTERVAL = 30000 // 30초
