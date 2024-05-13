import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@Common/layout'
import {
  Categories,
  ExchangerAccount,
  Exchangers,
  Helpers,
  Locals,
} from '@Admin/pages'
import { Page404 } from '@Common/pages'
import { ProtectedRoute } from '@Common/components'

export function AdminRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<ProtectedRoute allowed={['ADMIN']} />}>
          <Route path="/helpers" element={<Helpers />} />
          <Route path="/exchangers" element={<Exchangers />} />
          <Route path="/exchangers/:id" element={<ExchangerAccount />} />
          <Route path="/locals" element={<Locals />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </AppLayout>
  )
}
