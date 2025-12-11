import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { HomePage } from '@/pages/home'
import { ContentFormPage } from '@/pages/content-form'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
    element: <ContentFormPage />,
  },
  {
    path: '/content/:id/edit',
    element: <ContentFormPage />,
  },
  {
    path: '/alarm/new',
    element: <div>New Alarm Page (Protected)</div>,
  },
])
