import { AppLayout } from '@Common/layout'
import { HomePage } from '@Home/pages'
import { Route, Routes } from 'react-router-dom'

export function HomeRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AppLayout>
  )
}
