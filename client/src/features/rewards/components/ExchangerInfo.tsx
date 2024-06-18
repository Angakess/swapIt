import { Exchanger } from '../types'
import { Card, Descriptions } from 'antd'
import { DescriptionsProps } from 'antd/lib'
import dayjs from 'dayjs'

export function ExchangerInfo({ userData }: { userData: Exchanger }) {
  function translateGender() {
    if (userData?.gender === 'FEMALE') {
      return 'FEMENINO'
    }
    if (userData?.gender === 'MALE') {
      return 'MASCULINO'
    } else {
      return 'OTRO'
    }
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'DNI',
      children: userData.dni,
    },
    {
      key: '2',
      label: 'E-mail',
      children: userData.email,
    },
    {
      key: '3',
      label: 'Género',
      children: translateGender(),
    },
    {
      key: '4',
      label: 'Fecha de nacimiento',
      children: dayjs(userData.date_of_birth).format('DD/MM/YYYY'),
    },
    {
      key: '5',
      label: 'Teléfono',
      children: userData.phone_number,
    },
    {
      key: '6',
      label: 'Puntos',
      children: 'WIP',
    },
  ]

  return (
    <>
      <Card
        title={userData.full_name}
        style={{ marginBottom: '9px' }}
        styles={{ body: { padding: '14px' } }}
      >
        <Descriptions
          bordered
          layout="horizontal"
          column={1}
          items={items}
          labelStyle={{ width: '25%' }}
          contentStyle={{ padding: '10px' }}
        ></Descriptions>
      </Card>
    </>
  )
}
