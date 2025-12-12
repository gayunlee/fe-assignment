import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { HomePage } from '@/pages/home'
import { ContentFormPage } from '@/pages/content-form'
import { AlarmFormPage } from '@/pages/alarm-form'
import { ProtectedRoute } from '../providers/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/content/new',
    element: (
      <ProtectedRoute>
        <ContentFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/content/:id/edit',
    element: (
      <ProtectedRoute>
        <ContentFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/alarm/new',
    element: (
      <ProtectedRoute>
        <AlarmFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/alarm/:id/edit',
    element: (
      <ProtectedRoute>
        <AlarmFormPage />
      </ProtectedRoute>
    ),
  },
])
