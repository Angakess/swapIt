import { useState } from 'react'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { Layout, Menu, theme } from 'antd'

const { Header, Sider, Content } = Layout

type Props = {
  menuItems: ItemType[]
  header: React.ReactNode
  children: React.ReactNode
}

export function AppLayout({ menuItems, header, children }: Props) {
  const { colorBgContainer } = theme.useToken().token

  return (
    <Layout style={{ maxHeight: '100dvh' }}>
      <Sidebar menuItems={menuItems} />
      <Layout style={{ overflow: 'auto' }}>
        <Header
          style={{
            backgroundColor: colorBgContainer,
            padding: '0',
            marginBottom: '1.5rem',
          }}
        >
          {header}
        </Header>
        <Content
          style={{
            padding: '0 1.5rem',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
            height: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

type SidebarProps = {
  menuItems: ItemType[]
}

function Sidebar({ menuItems }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { colorBgContainer } = theme.useToken().token

  const backgroundColor = colorBgContainer

  return (
    <Sider
      theme="light"
      breakpoint="lg"
      collapsedWidth="3.75rem"
      style={{ backgroundColor }}
      collapsible
      collapsed={isCollapsed}
      onCollapse={() => setIsCollapsed(!isCollapsed)}
    >
      <Layout style={{ minHeight: '100dvh' }}>
        <Header
          style={{
            backgroundColor,
            padding: '0 0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'start',
          }}
        >
          <img
            src={isCollapsed ? '/logo-caritas-sm.svg' : '/logo-caritas.svg'}
            alt="logo caritas"
            style={{ height: '2.5rem' }}
          />
        </Header>
        <Content style={{ backgroundColor, paddingTop: '0.5rem' }}>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={menuItems}
          />
        </Content>
      </Layout>
    </Sider>
  )
}
