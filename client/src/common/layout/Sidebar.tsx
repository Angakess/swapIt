import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import { MenuProps } from 'antd/es/menu'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import {
  UploadOutlined,
  UserOutlined,
  ContactsOutlined,
  ProductOutlined,
  ShopOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { UserPermissions } from '@Common/types'
import { useAuth } from '@Common/hooks'

type SidebarProps = {
  menuItems: MenuItemType[]
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
    defaultSelectedKey: 'helpers',
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
        key: '/posts/add',
        label: 'Agregar Publicación',
        icon: <UploadOutlined />,
      },
    ],
  },
  HELPER: {
    defaultSelectedKey: '',
    menuItems: [
      {
        key: '/posts',
        label: 'Publicaciones',
        icon: <AppstoreOutlined />,
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
