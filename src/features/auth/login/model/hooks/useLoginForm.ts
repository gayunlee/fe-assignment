import { useState, useCallback, useMemo } from 'react'
import type { LoginFormState } from '../types'
import { VALIDATION } from '@/shared/config/constants'

const initialState: LoginFormState = {
  email: '',
  password: '',
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

export function useLoginForm() {
  const [formState, setFormState] = useState<LoginFormState>(initialState)

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

  const validate = useCallback((): boolean => {
    const emailError = validateEmail(formState.email)
    const passwordError = validatePassword(formState.password)

    setFormState((prev) => ({
      ...prev,
      errors: {
        email: emailError,
        password: passwordError,
      },
    }))

    return !emailError && !passwordError
  }, [formState.email, formState.password])

  const reset = useCallback(() => {
    setFormState(initialState)
  }, [])

  const isValid = useMemo(() => {
    return !validateEmail(formState.email) && !validatePassword(formState.password)
  }, [formState.email, formState.password])

  return {
    state: {
      email: formState.email,
      password: formState.password,
      errors: formState.errors,
      isValid,
    },
    reducer: {
      setEmail,
      setPassword,
      validate,
      reset,
    },
  }
}
