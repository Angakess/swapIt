import { useCustomAlerts } from '@Common/hooks'
import {
  Button,
  Card,
  Descriptions,
  DescriptionsProps,
  Flex,
  Modal,
  Spin,
} from 'antd'
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
  function CardHeader() {
    const sendAddHelper = () => {
      console.log('Lo agregaste como ayudante')
      alert.notImplementedYet()
      fetchData()
    }
    const sendBlock = () => {
      console.log('Lo bloqueaste')
      alert.notImplementedYet()
      fetchData()
    }
    const sendUnblock = () => {
      console.log('Lo desbloqueaste')
      alert.notImplementedYet()
      fetchData()
    }
    const sendUnlockAccount = () => {
      console.log("Le desbloqueaste el inicio de sesión")
      alert.notImplementedYet()
      fetchData()
    }

    const MakeButtons = () => {
      if(data?.state.name === "suspendido"){
        return (
          <>
            <Button type="primary" onClick={sendUnlockAccount} disabled={isLoading}>
              Desbloquear inicio de sesión
            </Button>
          </>
        )
      }
      if(data?.state.name === "bloqueado"){
        return (
          <>
            <Button type="primary" onClick={sendUnblock} disabled={isLoading}>
              Desbloquear cuenta
            </Button>
          </>
        )
      }
      return (
        <>
          <Button onClick={sendAddHelper} disabled={isLoading}>
              Incorporar como ayudante
            </Button>
            <Button
              type="primary"
              danger
              onClick={sendBlock}
              disabled={isLoading}
            >
              Bloquear
            </Button>
        </>
      )
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
    <Spin spinning={isLoading}>
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
  )
}
