import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@Auth/layouts'
import {
  ForgotPassword,
  Login,
  NewPassword,
  Register,
  EmailVerification,
  Verification,
} from '@Auth/pages'
import { ProtectedRoute } from '@Common/components'

export function AuthRoutes() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="/" element={<ProtectedRoute allowed={['UNREGISTERED']} />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verification" element={<Verification />} />
          <Route
            path="/email-verification/:code"
            element={<EmailVerification />}
          />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Route>
      </Routes>
    </AuthLayout>
  )
}
