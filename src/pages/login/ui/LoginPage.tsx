import { Link } from 'react-router-dom'
import { useLoginForm, useLoginActions } from '@/features/auth/login'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function LoginPage() {
  const { state, reducer } = useLoginForm()
  const { action, state: actionState } = useLoginActions()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reducer.validate()) {
      return
    }

    action.submitLogin({
      data: {
        email: state.email,
        password: state.password,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

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
                placeholder="비밀번호를 입력해주세요"
                value={state.password}
                onChange={(e) => reducer.setPassword(e.target.value)}
                aria-invalid={!!state.errors.password}
              />
              {state.errors.password && (
                <p className="text-sm text-red-500">{state.errors.password}</p>
              )}
            </div>

            {actionState.error && (
              <p className="text-sm text-red-500 text-center">
                로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={actionState.isPending}
            >
              {actionState.isPending ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
