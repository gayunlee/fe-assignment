export interface User {
  id: number
  email: string
  role: string
  membershipType: string
  createdAt: string
}

export interface UserSummary {
  id: number
  email: string
}

export interface UserResponse {
  success: boolean
  data: User
}
