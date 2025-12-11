import { useState, useCallback, useMemo } from 'react'
import type { RegisterFormState } from '../types'
import { VALIDATION } from '@/shared/config/constants'

const initialState: RegisterFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
}

function validateEmail(email: string): string | undefined {
  if (!email) {
    return '이메일을 입력해주세요'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식이 아닙니다'
  }
  return undefined
}

function validatePassword(password: string): string | undefined {
  if (!password) {
    return '비밀번호를 입력해주세요'
  }
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `비밀번호는 ${VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다`
  }
  return undefined
}

function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  if (!confirmPassword) {
    return '비밀번호 확인을 입력해주세요'
  }
  if (password !== confirmPassword) {
    return '비밀번호가 일치하지 않습니다'
  }
  return undefined
}

export function useRegisterForm() {
  const [formState, setFormState] = useState<RegisterFormState>(initialState)

  const setEmail = useCallback((email: string) => {
    setFormState((prev) => ({
      ...prev,
      email,
      errors: { ...prev.errors, email: undefined },
    }))
  }, [])

  const setPassword = useCallback((password: string) => {
    setFormState((prev) => ({
      ...prev,
      password,
      errors: { ...prev.errors, password: undefined },
    }))
  }, [])

  const setConfirmPassword = useCallback((confirmPassword: string) => {
    setFormState((prev) => ({
      ...prev,
      confirmPassword,
      errors: { ...prev.errors, confirmPassword: undefined },
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const emailError = validateEmail(formState.email)
    const passwordError = validatePassword(formState.password)
    const confirmPasswordError = validateConfirmPassword(
      formState.password,
      formState.confirmPassword
    )

    setFormState((prev) => ({
      ...prev,
      errors: {
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      },
    }))

    return !emailError && !passwordError && !confirmPasswordError
  }, [formState.email, formState.password, formState.confirmPassword])

  const reset = useCallback(() => {
    setFormState(initialState)
  }, [])

  const isValid = useMemo(() => {
    return (
      !validateEmail(formState.email) &&
      !validatePassword(formState.password) &&
      !validateConfirmPassword(formState.password, formState.confirmPassword)
    )
  }, [formState.email, formState.password, formState.confirmPassword])

  return {
    state: {
      email: formState.email,
      password: formState.password,
      confirmPassword: formState.confirmPassword,
      errors: formState.errors,
      isValid,
    },
    reducer: {
      setEmail,
      setPassword,
      setConfirmPassword,
      validate,
      reset,
    },
  }
}
