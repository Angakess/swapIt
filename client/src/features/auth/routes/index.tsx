import { Routes, Route, Navigate } from 'react-router-dom'
import {
  ForgotPassword,
  Login,
  NewPassword,
  Register,
  EmailVerification,
  Verification2FA,
} from '@Auth/pages'
import { ProtectedRoute } from '@Common/components'

export function AuthRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['UNREGISTERED']} />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification2FA />} />
        <Route
          path="/email-verification/:code"
          element={<EmailVerification />}
        />
        <Route path="/reset-password/:code" element={<NewPassword />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>
    </Routes>
  )
}
