import { useState } from 'react'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { Layout, Menu, theme } from 'antd'

const { Header, Sider, Content } = Layout

type Props = {
  menuItems: ItemType[]
  content: React.ReactNode
}

export function AppLayout({ menuItems, content }: Props) {
  const { colorBgContainer } = theme.useToken().token

  return (
    <Layout>
      <Sidebar menuItems={menuItems} />
      <Layout>
        <Header style={{ backgroundColor: colorBgContainer, padding: 0 }}>
          <h1>Header</h1>
        </Header>
        <Content>{content}</Content>
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
            style={{ height: '3rem' }}
          />
        </Header>
        <Content style={{ backgroundColor }}>
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
