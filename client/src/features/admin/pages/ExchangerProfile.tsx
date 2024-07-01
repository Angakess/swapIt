import { ModalSubChoice } from '@Admin/components'
import { PageTitle } from '@Common/components'
import { useCustomAlerts } from '@Common/hooks'
import { Page404 } from '@Common/pages'
import {
  Button,
  Card,
  Descriptions,
  DescriptionsProps,
  Flex,
  Modal,
  Popconfirm,
  Select,
  Spin,
} from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { useEffect, useState } from 'react'

type DataType = {
  id: number
  full_name: string
  dni: string
  email: string
  gender: string
  date_of_birth: string
  phone_number: string
  state: {
    id: number
    name: string
  }
}

export function ExchangerProfile() {
  const [openModal, setOpenModal] = useState(false)
  const [exists, setExists] = useState(true)
  const miniModal = useCustomAlerts()

  function CardHeader() {
    const sendAddHelper = async () => {
      console.log('Lo agregaste como ayudanteasdsadasdasdas')
      setOpenModal(true)
    }
    const sendBlock = async () => {
      console.log('Lo bloqueaste')
      setIsLoading(true)
      const res = await fetch(
        `http://localhost:8000/users/put-in-review/${exchangerId}`
      )
      const result = await res.json()
      if (result.ok) {
        miniModal.successNotification(
          'Operación exitosa',
          'Usuario bloqueado exitosamente'
        )
      } else {
        miniModal.errorNotification('Operación fallida', result.messages[0])
      }
      setIsLoading(false)
      fetchData()
    }
    const sendUnblock = async () => {
      console.log('Lo desbloqueaste')
      /* alert.notImplementedYet() */
      setIsLoading(true)
      const res = await fetch(
        `http://localhost:8000/users/remove-user-from-review/${exchangerId}`
      )
      const result = await res.json()
      if (result.ok) {
        miniModal.successNotification(
          'Operación exitosa',
          'Usuario desbloqueado exitosamente'
        )
      } else {
        miniModal.errorNotification('Operación fallida', result.messages[0])
      }
      setIsLoading(false)
      fetchData()
    }
    /* const sendUnlockAccount = () => {
      console.log('Le desbloqueaste el inicio de sesión')
      alert.notImplementedYet()
      fetchData()
    } */

    const MakeButtons = () => {
      if (data?.state.name === 'suspendido') {
        return (
          <>
            <Popconfirm
              title="¿Está seguro que quiere desbloquear este usuario?"
              okText="Confirmar"
              cancelText="Cancelar"
              onConfirm={sendUnblock}
            >
              <Button type="primary" disabled={isLoading}>
                Desbloquear inicio de sesión
              </Button>
            </Popconfirm>
          </>
        )
      }
      if (data?.state.name === 'bloqueado') {
        return (
          <>
            <Popconfirm
              title="¿Está seguro que quiere desbloquear este usuario?"
              okText="Confirmar"
              cancelText="Cancelar"
              onConfirm={sendUnblock}
            >
              <Button type="primary" disabled={isLoading}>
                Desbloquear cuenta
              </Button>
            </Popconfirm>
          </>
        )
      }
      if (data?.state.name === 'activo') {
        return (
          <>
            <Button onClick={sendAddHelper} disabled={isLoading}>
              Incorporar como ayudante
            </Button>
            <ModalSubChoice
              openModal={openModal}
              setOpenModal={setOpenModal}
              loading={isLoading}
              setLoading={setIsLoading}
              userId={exchangerId}
              setExists={setExists}
            ></ModalSubChoice>

            <Popconfirm
              title="¿Está seguro que quiere bloquear este usuario?"
              okText="Confirmar"
              cancelText="Cancelar"
              onConfirm={sendBlock}
            >
              <Button
                type="primary"
                danger
                /* onClick={sendBlock} */
                disabled={isLoading}
              >
                Bloquear
              </Button>
            </Popconfirm>
          </>
        )
      }
      return <></>
    }

    return (
      <Flex align="center" gap="small">
        <h3 style={{ marginRight: 'auto', marginBottom: '0' }}>
          Perfil de usuario intercambiador
        </h3>
        <MakeButtons />
      </Flex>
    )
  }

  const parts = window.location.href.split('/')
  const exchangerId: number = parseInt(parts[parts.length - 1])

  const alert = useCustomAlerts()

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<DataType>()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `http://localhost:8000/users/get-exchanger/${exchangerId}`
      )
      const result = await res.json()
      setData(result)
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'No se encontro al intercambiador solicitado',
      })
    }
    setIsLoading(false)
  }
  useEffect(() => {
    fetchData()
  }, [])

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Nombre',
      children: `${data?.full_name}`,
    },
    {
      key: '2',
      label: 'DNI',
      children: `${data?.dni}`,
    },
    {
      key: '3',
      label: 'Email',
      children: `${data?.email}`,
    },
    {
      key: '4',
      label: 'Teléfono',
      children: `${data?.phone_number}`,
    },
    {
      key: '5',
      label: 'Fecha de nacimiento',
      children: `${data?.date_of_birth}`,
    },
    {
      key: '6',
      label: 'Género',
      children: `${data?.gender}`,
    },
    {
      key: '7',
      label: 'Estado',
      children: `${data?.state.name}`,
    },
  ]

  return (
    <>
      {exists ? (
        <Spin spinning={isLoading}>
          <PageTitle title={`Intercambiador - ${data?.full_name}`} />
          <Card title={<CardHeader />}>
            <Descriptions
              bordered
              layout="horizontal"
              column={1}
              items={items}
              labelStyle={{ width: '15%' }}
            />
          </Card>
        </Spin>
      ) : (
        <Page404></Page404>
      )}
    </>
  )
}
