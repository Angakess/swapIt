import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@Auth/layouts'
import {
  ForgotPassword,
  Login,
  NewPassword,
  Register,
  Verification,
} from '@Auth/pages'

export function AuthRoutes() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="verification" element={<Verification />} />
        <Route path="new-password" element={<NewPassword />} />{' '}
        {/* seguramente temporal, averiguar para link con vencimiento */}
        <Route path="/*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </AuthLayout>
  )
}
