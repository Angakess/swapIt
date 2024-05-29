import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'

import { Page404 } from '@Common/pages'
import { SwapsList, Swap } from '@Swaps/pages'

export function SwapsRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['HELPER']} />}>
        <Route path="/" element={<SwapsList />} />
        <Route path="/:id" element={<Swap />} />
        <Route path="/*" element={<Page404 />} />
      </Route>
    </Routes>
  )
}
