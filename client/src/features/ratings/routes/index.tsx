import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'
import { Page404 } from '@Common/pages'
import { Rating } from '@Ratings/pages'

export function RatingRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['EXCHANGER']} />}>
        <Route path="calificate/:rol/:id" element={<Rating />} />
      </Route>

      <Route path="/*" element={<Page404 />} />
    </Routes>
  )
}
