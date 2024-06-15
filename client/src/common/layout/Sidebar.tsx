import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme, MenuProps } from 'antd'
import {
  /* UploadOutlined, */
  CalendarOutlined,
  UserOutlined,
  ContactsOutlined,
  ProductOutlined,
  ShopOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SwapOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import { UserPermissions } from '@Common/types'
import { useAuth } from '@Common/hooks'

type SidebarProps = {
  menuItems: Required<MenuProps>['items']
  defaultSelectedKey: string
}

const items: Record<UserPermissions, SidebarProps> = {
  UNREGISTERED: {
    defaultSelectedKey: '/home',
    menuItems: [
      {
        key: '/home',
        label: 'Home',
        icon: <HomeOutlined />,
      },
    ],
  },
  ADMIN: {
    defaultSelectedKey: '/posts',
    menuItems: [
      {
        key: '/posts',
        label: 'Publicaciones',
        icon: <AppstoreOutlined />,
      },
      {
        key: '/admin/helpers',
        label: 'Ayudantes',
        icon: <ContactsOutlined />,
      },
      {
        key: '/admin/exchangers',
        label: 'Intercambiadores',
        icon: <UserOutlined />,
      },
      {
        key: '/admin/locals',
        label: 'Filiales',
        icon: <ShopOutlined />,
      },
      {
        key: '/admin/categories',
        label: 'Categorias',
        icon: <ProductOutlined />,
      },
      {
        key: '/admin/stats',
        label: 'Estadísticas',
        icon: <BarChartOutlined />,
        children: [
          {
            key: '/admin/stats/posts',
            label: 'Publicaciones',
          },
          {
            key: '/admin/stats/helpers',
            label: 'Ayudantes',
          },
          {
            key: '/admin/stats/exchangers',
            label: 'Intercambiadores',
          },
          {
            key: '/admin/stats/locals',
            label: 'Filiales',
          },
          {
            key: '/admin/stats/categories',
            label: 'Categorias',
          },
          {
            key: '/admin/stats/swaps',
            label: 'Trueques',
          },
        ],
      },
    ],
  },
  EXCHANGER: {
    defaultSelectedKey: '/posts',
    menuItems: [
      {
        key: '/posts',
        label: 'Publicaciones',
        icon: <AppstoreOutlined />,
      },
      {
        key: '/posts/my-posts',
        label: 'Mis Publicaciones',
        icon: <ProductOutlined />,
      },
      {
        key: '/requests/my-requests',
        label: 'Mis Solicitudes',
        icon: <SwapOutlined />,
      },
      {
        key: '/turns/my-turns',
        label: 'Mis Turnos',
        icon: <CalendarOutlined />,
      },
    ],
  },
  HELPER: {
    defaultSelectedKey: '/posts',
    menuItems: [
      {
        key: '/posts',
        label: 'Publicaciones',
        icon: <AppstoreOutlined />,
      },
      {
        key: '/swaps',
        label: 'Trueques del día',
        icon: <SwapOutlined />,
      },
    ],
  },
}

export function Sidebar() {
  const { getPermission } = useAuth()

  const location = useLocation()
  const navigate = useNavigate()
  const [activeKey, setActiveKey] = useState(
    items[getPermission()].defaultSelectedKey
  )

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
            padding: isCollapsed ? '0 0.625rem' : '0 0.875rem',
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
            items={items[getPermission()].menuItems}
            onClick={handleMenuItemClick}
            selectedKeys={[activeKey]}
          />
        </Layout.Content>
      </Layout>
    </Layout.Sider>
  )
}
