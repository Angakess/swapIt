import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'
import { AppLayout } from '@Common/layout'
import { Page404 } from '@Common/pages'
import { MyTurns, Turn } from '@Turns/pages'

export function TurnsRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/my-turns"
          element={<ProtectedRoute allowed={['EXCHANGER']} />}
        >
          <Route path="/my-turns" element={<MyTurns />} />
          <Route path="/my-turns/:id" element={<Turn />} />
        </Route>
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </AppLayout>
  )
}
