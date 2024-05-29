import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'

import { Sidebar } from './Sidebar'
import { AppHeader } from './AppHeader'

export function AppLayout() {
  const { colorBgContainer } = theme.useToken().token

  return (
    <Layout style={{ maxHeight: '100dvh' }}>
      <Sidebar />
      <Layout style={{ overflow: 'auto' }}>
        <Layout.Header
          style={{
            backgroundColor: colorBgContainer,
            padding: '0',
            marginBottom: '1.5rem',
          }}
        >
          <AppHeader />
        </Layout.Header>
        <Layout.Content
          style={{
            padding: '0 1.5rem',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
            height: 'auto',
          }}
        >
          <div style={{ paddingBottom: '2rem' }}>{<Outlet />}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
