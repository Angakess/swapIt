import { Routes, Route } from 'react-router-dom'
import { AuthLayout } from '@Auth/layouts'
import { ForgotPassword, Login, Register } from '@Auth/pages'

export function AuthRoutes() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </AuthLayout>
  )
}
