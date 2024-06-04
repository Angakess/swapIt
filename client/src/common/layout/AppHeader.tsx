import { LogoutOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, theme } from 'antd'
import { UserAvatar } from '@Common/components/UserAvatar'
import { useAuth, useCustomAlerts } from '@Common/hooks'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getUserScore } from '@Common/api'

export function AppHeader() {
  const customAlerts = useCustomAlerts()
  const { user, logOut, isLoggedIn } = useAuth()
  const { colorErrorActive } = theme.useToken().token
  const [userScore, setUserScore] = useState<number>()

  useEffect(() => {
    if (user?.role !== 'EXCHANGER') return

    const INTERVAL_MS = 1000 * 60 * 5 // 5 minutos

    getUserScore(user.id).then(setUserScore)

    const interval = setInterval(() => {
      getUserScore(user.id).then(setUserScore)
    }, INTERVAL_MS)

    return () => clearInterval(interval)
  }, [user])

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
        &#9474;
        <Button type="link" size="small">
          <Link to="/auth/register">Registrarse</Link>
        </Button>
      </Flex>
    )
  }

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
              onClick: customAlerts.notImplementedYet,
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
            score={userScore}
            order="nameFirst"
          />
        </div>
      </Dropdown>
    </Flex>
  )
}
