import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'
import { MyTurns, Turn } from '@Turns/pages'
import { Page404 } from '@Common/pages'

export function TurnsRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={['EXCHANGER']} />}>
        <Route path="/my-turns" element={<MyTurns />} />
        <Route path="/my-turns/:id" element={<Turn />} />
        <Route path="/*" element={<Page404 />} />
      </Route>
    </Routes>
  )
}
