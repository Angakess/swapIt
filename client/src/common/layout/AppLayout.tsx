import { Layout, theme } from 'antd'
import { Sidebar } from './Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
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
          header
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
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
