import { ProtectedRoute } from '@Common/components'
import { AppLayout } from '@Common/layout'
import { Page404 } from '@Common/pages'
import { HomePage } from '@Home/pages'
import { Route, Routes } from 'react-router-dom'

export function HomeRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<ProtectedRoute allowed={['UNREGISTERED']} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<Page404 />} />
        </Route>
      </Routes>
    </AppLayout>
  )
}
