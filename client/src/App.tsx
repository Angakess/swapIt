import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { AuthRoutes } from '@Auth/routes'
import { PostsRoutes } from '@Posts/routes'
import { AdminRoutes } from '@Admin/routes'
import { HomePage } from '@Home/pages'
import { AuthProvider } from '@Auth/context'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#14518b',
          colorInfo: '#14518b',
          colorTextBase: '#061726',
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/*" element={<AuthRoutes />} />
            <Route path="/posts/*" element={<PostsRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
