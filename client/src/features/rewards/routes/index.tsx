import { ProtectedRoute } from '@Common/components'
import { Page404 } from '@Common/pages'
import { ExchangerSearch } from '@Rewards/pages'
import { Route, Routes } from 'react-router-dom'

export function RewardsRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['HELPER']} />}>
        <Route path="/search-exchanger" element={<ExchangerSearch />} />
        <Route path="/*" element={<Page404 />} />
      </Route>
    </Routes>
  )
}
