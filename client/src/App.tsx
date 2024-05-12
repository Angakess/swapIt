import { Routes, Route } from 'react-router-dom'
import { AuthRoutes } from '@Auth/routes'
import { PostsRoutes } from '@Posts/routes'
import { AdminRoutes } from '@Admin/routes'
import { HomePage } from '@Home/pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/posts/*" element={<PostsRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}

export default App
