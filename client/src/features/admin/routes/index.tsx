import { Route, Routes } from 'react-router-dom'
import {
  Categories,
  ChangeLocal,
  ExchangerProfile,
  Exchangers,
  Helpers,
  Locals,
} from '@Admin/pages'
import { Page404 } from '@Common/pages'
import { ProtectedRoute } from '@Common/components'
import { StatsRoutes } from '@Stats/routes'
import { Ratings } from '@Ratings/pages'

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['ADMIN']} />}>
        <Route path="/helpers" element={<Helpers />} />
        <Route path="/helpers/change-local/:id" element={<ChangeLocal />} />
        <Route path="/exchangers" element={<Exchangers />} />
        <Route path="/exchangers/:id" element={<ExchangerProfile />} />
        <Route path="/locals" element={<Locals />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/stats/*" element={<StatsRoutes />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  )
}
