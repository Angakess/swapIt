import { Button, Card, Descriptions, DescriptionsProps, Flex, Spin } from 'antd'
import { useEffect, useState } from 'react'
import MOCK_DATA from './MOCK_DATA_EXCH_ACCOUNT.json'

type DataType = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  gender: string
  date_of_birth: string
  phone_number: string
  status: string
}

export function ExchangerProfile() {

  function CardHeader() {

    const sendAddHelper = () => {
        setIsLoading(true)
        console.log("se incorporo al intercambiador con id: ",data.id)
        fetchData()
        setIsLoading(false)
    }
    const sendBlock = () => {
        setIsLoading(true)
        console.log("se bloqueo al intercambiador con id: ",data.id)
        fetchData()
        setIsLoading(false)
    }
    const sendUnblock = () => {
        setIsLoading(true)
        console.log("se desbloqueo al intercambiador con id: ",data.id)
        fetchData()
        setIsLoading(false)
    }


    return (
      <Flex align="center" gap="small">
        <h3 style={{ marginRight: 'auto', marginBottom: "0" }}>Perfil de usuario intercambiador</h3>
        {(data.status !== "active") ?
            (<>
                <Button onClick={sendAddHelper} disabled={isLoading}>Incorporar como ayudante</Button>
                <Button type='primary' danger onClick={sendBlock} disabled={isLoading}>Bloquear</Button>
            </>) : 
                <Button type='primary' onClick={sendUnblock} disabled={isLoading}>Desbloquear</Button>}
      </Flex>
    )
  }

  const parts = window.location.href.split('/')
  const index: number = parseInt(parts[parts.length - 1])


  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<DataType>({
    id: 0,
    first_name: '',
    last_name: '',
    dni: '',
    email: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    status: '',
  })
  const fetchData = () => {
    setData(MOCK_DATA[index])
    console.log('fetching data')
  }
  useEffect(fetchData)

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Nombre',
      children: `${data.first_name} ${data.last_name}`,
    },
    {
      key: '2',
      label: 'DNI',
      children: `${data.dni}`,
    },
    {
      key: '3',
      label: 'Email',
      children: `${data.email}`,
    },
    {
      key: '4',
      label: 'Teléfono',
      children: `${data.phone_number}`,
    },
    {
      key: '5',
      label: 'Fecha de nacimiento',
      children: `${data.date_of_birth}`,
    },
    {
      key: '6',
      label: 'Género',
      children: `${data.gender}`,
    },
    {
      key: '7',
      label: 'Estado',
      children: `${data.status}`,
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
