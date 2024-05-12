import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'

import 'antd/dist/reset.css'

import { AuthProvider } from '@Auth/context'
import App from 'App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#14518b',
              colorInfo: '#14518b',
              colorTextBase: '#061726',
            },
          }}
        >
          <AntdApp>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </AntdApp>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
