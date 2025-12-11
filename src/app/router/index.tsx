import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home Page (Protected)</div>,
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
    element: <div>New Content Page (Protected)</div>,
  },
  {
    path: '/content/:id/edit',
    element: <div>Edit Content Page (Protected)</div>,
  },
  {
    path: '/alarm/new',
    element: <div>New Alarm Page (Protected)</div>,
  },
])
