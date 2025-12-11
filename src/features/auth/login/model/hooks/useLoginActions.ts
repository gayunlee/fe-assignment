import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../../api'
import type { LoginRequest } from '../types'

export function useLoginActions() {
  const navigate = useNavigate()
  const { mutate: loginMutate, isPending, error } = useLogin()

  const submitLogin = useCallback(
    ({
      data,
      onSuccess,
      onError,
    }: {
      data: LoginRequest
      onSuccess?: () => void
      onError?: (error: Error) => void
    }) => {
      loginMutate(data, {
        onSuccess: () => {
          onSuccess?.()
          navigate('/')
        },
        onError: (err) => {
          onError?.(err as Error)
        },
      })
    },
    [loginMutate, navigate]
  )

  return {
    action: {
      submitLogin,
    },
    state: {
      isPending,
      error,
    },
  }
}
