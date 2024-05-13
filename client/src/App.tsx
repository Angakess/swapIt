import { Route, Routes } from 'react-router-dom'
import { AdminRoutes } from '@Admin/routes'
import { AuthRoutes } from '@Auth/routes'
import { HomeRoutes } from '@Home/routes'
import { PostsRoutes } from '@Posts/routes'

function App() {
  return (
    <Routes>
      <Route path="/home/*" element={<HomeRoutes />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/posts/*" element={<PostsRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}

export default App
