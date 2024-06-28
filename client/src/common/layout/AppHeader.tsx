import { LogoutOutlined, EditOutlined, StarOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, MenuProps, theme } from 'antd'
import { UserAvatar } from '@Common/components/UserAvatar'
import { useAuth } from '@Common/hooks'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { UserRatingModel, getUserRatings, getUserScore } from '@Common/api'
import { EditProfileModal, ListRatingsModal } from '@Common/components'

export function AppHeader() {
  const { isLoggedIn } = useAuth()

  return (
    <Flex
      align="center"
      justify="end"
      style={{ height: '100%', padding: '0 1rem' }}
    >
      {isLoggedIn() ? <LoggedInContent /> : <NotLoggedInContent />}

      <Link to="/donation" style={{ marginLeft: '10px' }}>
        <Button type="primary" size="large">
          Donar
        </Button>
      </Link>
    </Flex>
  )
}

function NotLoggedInContent() {
  return (
    <>
      <Button type="link" size="small">
        <Link to="/auth/login">Iniciar sesión</Link>
      </Button>
      &#9474;
      <Button type="link" size="small">
        <Link to="/auth/register">Registrarse</Link>
      </Button>
    </>
  )
}

function LoggedInContent() {
  const { colorErrorActive } = theme.useToken().token
  const { user, logOut } = useAuth()

  const [userScore, setUserScore] = useState<number>()
  const [userRatings, setUserRatings] = useState<UserRatingModel[]>([])
  const [isUserRatingOpen, setIsUserRatingOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  useEffect(() => {
    if (user?.role !== 'EXCHANGER') return

    const INTERVAL_MS = 1000 * 60 * 5 // 5 minutos

    getUserScore(user.id).then(setUserScore)

    const interval = setInterval(() => {
      getUserScore(user.id).then(setUserScore)
    }, INTERVAL_MS)

    return () => clearInterval(interval)
  }, [user])

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = []

    if (user?.role === 'EXCHANGER') {
      items.push({
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
      })
    }

    if (user?.role !== 'ADMIN') {
      items.push({
        key: '2',
        icon: <EditOutlined />,
        label: 'Editar perfil',
        onClick: () => setIsEditProfileOpen(true),
      })
    }

    items.push({
      key: '3',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      style: { color: colorErrorActive },
      onClick: () => logOut(),
    })

    return items
  }, [colorErrorActive, logOut, user])

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
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
      <ListRatingsModal
        title="Mis calificaciones"
        isOpen={isUserRatingOpen}
        setIsOpen={setIsUserRatingOpen}
        ratings={userRatings}
        isLoading={isLoading}
      />
      <EditProfileModal
        isOpen={isEditProfileOpen}
        setIsOpen={setIsEditProfileOpen}
      />
    </>
  )
}
