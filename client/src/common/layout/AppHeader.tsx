import { LogoutOutlined, EditOutlined, StarOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, theme } from 'antd'
import { UserAvatar } from '@Common/components/UserAvatar'
import { useAuth, useCustomAlerts } from '@Common/hooks'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { UserRatingModel, getUserRatings, getUserScore } from '@Common/api'
import { ListRatingsModal } from '@Common/components'

export function AppHeader() {
  const { colorErrorActive } = theme.useToken().token
  const customAlerts = useCustomAlerts()
  const { user, logOut, isLoggedIn } = useAuth()

  const [userScore, setUserScore] = useState<number>()
  const [userRatings, setUserRatings] = useState<UserRatingModel[]>([])
  const [isUserRatingOpen, setIsUserRatingOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

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
    <>
      <Flex
        align="center"
        justify="end"
        style={{ height: '100%', padding: '0 1rem' }}
      >
        <Dropdown
          menu={{
            items: [
              ...(user?.role === 'EXCHANGER'
                ? [
                    {
                      key: '1',
                      icon: <StarOutlined />,
                      label: 'Ver mis calificaciones',
                      onClick: () => {
                        setIsUserRatingOpen(true)
                        setIsLoading(true)
                        getUserRatings(user!.id).then((fetchedRatings) => {
                          setUserRatings(fetchedRatings)
                          setIsLoading(false)
                        })
                      },
                    },
                  ]
                : []),
              {
                key: '2',
                icon: <EditOutlined />,
                label: 'Editar perfil',
                onClick: customAlerts.notImplementedYet,
              },
              {
                key: '3',
                icon: <LogoutOutlined />,
                label: 'Cerrar sesión',
                style: { color: colorErrorActive },
                onClick: () => logOut(),
              },
            ],
          }}
          placement="bottom"
          arrow={{ pointAtCenter: true }}
          overlayStyle={{ maxWidth: 'fit-content', minWidth: 'none' }}
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
      <ListRatingsModal
        title="Mis calificaciones"
        isOpen={isUserRatingOpen}
        setIsOpen={setIsUserRatingOpen}
        ratings={userRatings}
        isLoading={isLoading}
      />
    </>
  )
}
