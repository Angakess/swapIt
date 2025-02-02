import { Navigate, Route, Routes } from 'react-router-dom'

// Routes
import { AdminRoutes } from '@Admin/routes'
import { AuthRoutes } from '@Auth/routes'
import { HomeRoutes } from '@Home/routes'
import { PostsRoutes } from '@Posts/routes'
import { TurnsRoutes } from '@Turns/routes'
import { SwapsRoutes } from '@Swaps/routes'
import { RequestsRoutes } from '@Requests/routes'
import { RewardsRoutes } from '@Rewards/routes'
import { DonationRoutes } from '@Donation/routes'

// Pages
import { Page404 } from '@Common/pages'
import { Page403 } from '@Common/pages/Page403'

// Others
import { useAuth } from '@Common/hooks'
import { UserPermissions } from '@Common/types'
import { AuthLayout } from '@Auth/layouts'
import { AppLayout } from '@Common/layout'
import { RatingRoutes } from '@Ratings/routes'

const mainPages: Record<UserPermissions, string> = {
  ADMIN: '/admin/helpers',
  EXCHANGER: '/posts',
  HELPER: '/posts',
  UNREGISTERED: '/home',
}

function App() {
  const { getPermission } = useAuth()

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth/*" element={<AuthRoutes />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/home/*" element={<HomeRoutes />} />
        <Route path="/posts/*" element={<PostsRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/turns/*" element={<TurnsRoutes />} />
        <Route path="/swaps/*" element={<SwapsRoutes />} />
        <Route path="/ratings/*" element={<RatingRoutes />} />
        <Route path="/requests/*" element={<RequestsRoutes />} />
        <Route path="/rewards/*" element={<RewardsRoutes />} />
        <Route path="/donation/*" element={<DonationRoutes />} />
      </Route>

      <Route path="/403" element={<Page403 />} />
      <Route
        path="/"
        element={<Navigate to={mainPages[getPermission()]} replace />}
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  )
}

export default App
