import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'
import { MyRequests, Request } from '@Requests/pages'
import { Page404 } from '@Common/pages'

export function RequestsRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['EXCHANGER']} />}>
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/my-requests/:id" element={<Request />} />
        <Route path="/*" element={<Page404 />} />
      </Route>
    </Routes>
  )
}
