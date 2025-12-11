import { Link, useNavigate } from 'react-router-dom'
import { useRegisterForm, useRegister } from '@/features/auth/register'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function RegisterPage() {
  const navigate = useNavigate()
  const { state, reducer } = useRegisterForm()
  const { mutate: registerMutate, isPending, error } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reducer.validate()) {
      return
    }

    registerMutate(
      {
        email: state.email,
        password: state.password,
      },
      {
        onSuccess: () => {
          navigate('/')
        },
      }
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={state.email}
                onChange={(e) => reducer.setEmail(e.target.value)}
                aria-invalid={!!state.errors.email}
              />
              {state.errors.email && (
                <p className="text-sm text-red-500">{state.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요 (6자 이상)"
                value={state.password}
                onChange={(e) => reducer.setPassword(e.target.value)}
                aria-invalid={!!state.errors.password}
              />
              {state.errors.password && (
                <p className="text-sm text-red-500">{state.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={state.confirmPassword}
                onChange={(e) => reducer.setConfirmPassword(e.target.value)}
                aria-invalid={!!state.errors.confirmPassword}
              />
              {state.errors.confirmPassword && (
                <p className="text-sm text-red-500">{state.errors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                회원가입에 실패했습니다. 다시 시도해주세요.
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
