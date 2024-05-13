import { LogoutOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, theme } from 'antd'
import { UserAvatar } from '@Common/components/UserAvatar'
import { useAuth } from '@Common/hooks'
import { Link } from 'react-router-dom'

export default function AppHeader() {
  const { user, logOut, isLoggedIn } = useAuth()
  const { colorErrorActive } = theme.useToken().token

  if (!isLoggedIn()) {
    return (
      <Flex
        align="center"
        justify="end"
        style={{ height: '100%', padding: '0 1rem' }}
      >
        <Button type="link" size="small">
          <Link to="/auth/login">Iniciar sesión</Link>
        </Button>
        │
        <Button type="link" size="small">
          <Link to="/auth/register">Registrarse</Link>
        </Button>
      </Flex>
    )
  }

  if (isLoggedIn()) {
    return (
      <Flex
        align="center"
        justify="end"
        style={{ height: '100%', padding: '0 1rem' }}
      >
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                icon: <EditOutlined />,
                label: 'Editar perfil',
              },
              {
                key: '2',
                icon: <LogoutOutlined />,
                label: 'Cerrar sesión',
                style: { color: colorErrorActive },
                onClick: () => logOut(),
              },
            ],
          }}
          placement="bottom"
          arrow={{ pointAtCenter: true }}
          overlayStyle={{ marginTop: '10px' }}
        >
          <div>
            <UserAvatar
              firstName={user!.first_name}
              lastName={user!.last_name}
              order="nameFirst"
            />
          </div>
        </Dropdown>
      </Flex>
    )
  }

  return <>asd</>
}
