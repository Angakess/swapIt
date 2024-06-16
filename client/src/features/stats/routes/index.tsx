import { ProtectedRoute } from '@Common/components'
import { Page404 } from '@Common/pages'
import { StatsHelpers, StatsPosts } from '@Stats/pages'
import { Route, Routes } from 'react-router-dom'

export function StatsRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['ADMIN']} />}>
        <Route path="/posts" element={<StatsPosts />} />
        <Route path="/helpers" element={<StatsHelpers />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  )
}
