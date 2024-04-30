import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthRoutes } from '@Auth/routes'
import { ConfigProvider } from 'antd'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#14518b',
          colorInfo: '#d02f4c',
          colorTextBase: '#061726',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<AuthRoutes />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
