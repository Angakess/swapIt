import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'
import { Page404 } from '@Common/pages'
import { HomePage } from '@Home/pages'

export function HomeRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['UNREGISTERED']} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  )
}
