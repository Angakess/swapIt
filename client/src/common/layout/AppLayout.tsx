import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import { MenuProps } from 'antd/es/menu'

export type SidebarProps = {
  menuItems: MenuItemType[]
  defaultSelectedKey: string
}

type Props = {
  sidebarProps: SidebarProps
  children: React.ReactNode
}

export function AppLayout({ sidebarProps, children }: Props) {
  const { colorBgContainer } = theme.useToken().token

  return (
    <Layout style={{ maxHeight: '100dvh' }}>
      <Sidebar {...sidebarProps} />
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

function Sidebar({ menuItems, defaultSelectedKey }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState(defaultSelectedKey)

  const [isCollapsed, setIsCollapsed] = useState(false)
  const { colorBgContainer } = theme.useToken().token

  const backgroundColor = colorBgContainer

  useEffect(() => {
    setActiveKey(location.pathname)
  }, [location])

  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout.Sider
      theme="light"
      breakpoint="lg"
      collapsedWidth="3.75rem"
      style={{ backgroundColor }}
      collapsible
      collapsed={isCollapsed}
      onCollapse={() => setIsCollapsed(!isCollapsed)}
    >
      <Layout style={{ minHeight: '100dvh' }}>
        <Layout.Header
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
        </Layout.Header>
        <Layout.Content style={{ backgroundColor, paddingTop: '0.5rem' }}>
          <Menu
            theme="light"
            mode="inline"
            items={menuItems}
            onClick={handleMenuItemClick}
            selectedKeys={[activeKey]}
          />
        </Layout.Content>
      </Layout>
    </Layout.Sider>
  )
}
