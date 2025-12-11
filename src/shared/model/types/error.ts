export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  status: number
  message: string
  validationErrors?: ValidationError[]
}
