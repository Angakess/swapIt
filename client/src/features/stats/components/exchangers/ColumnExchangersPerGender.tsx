import { Button, Card, Flex, Spin, Typography } from 'antd'
import {
  ExchangerModel,
  UserGenderEnum,
  UserStateName,
  UserStateNameEnum,
} from '@Common/api'
import { useEffect, useState } from 'react'
import { Column } from '@ant-design/charts'

type ColumnExchangersPerGenderProps = {
  isLoading: boolean
  exchangers: ExchangerModel[]
}

export function ColumnExchangersPerGender({
  exchangers,
  isLoading,
}: ColumnExchangersPerGenderProps) {
  type DataType = {
    state: UserStateName
    gender: string
    amount: number
  }

  const [stack, setStack] = useState(true)
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    const newData: DataType[] = []

    // Generar los datos
    Object.values(UserGenderEnum).forEach((gender) => {
      const exchangersGender = exchangers.filter((e) => e.gender === gender)

      Object.values(UserStateNameEnum).forEach((state) => {
        newData.push({
          gender,
          state,
          amount: exchangersGender.filter(
            ({ user_state }) => user_state === state
          ).length,
        })
      })
    })

    // Poner en español los géneros:
    const translations: { [gender: string]: string } = {
      FEMALE: 'femenino',
      MALE: 'masculino',
      OTHER: 'otro',
    }
    newData.forEach((value) => (value.gender = translations[value.gender]))

    // Ordenar
    const genderPriority: { [gender: string]: number } = {
      femenino: 1,
      masculino: 2,
      otro: 3,
    }

    const statePriority: { [state in UserStateName]: number } = {
      activo: 1,
      inactivo: 2,
      bloqueado: 3,
      eliminado: 4,
      suspendido: 5,
    }

    newData.sort((a, b) => {
      if (genderPriority[a.gender] > genderPriority[b.gender]) return 1
      if (genderPriority[a.gender] < genderPriority[b.gender]) return -1
      if (statePriority[a.state] > statePriority[b.state]) return 1
      if (statePriority[a.state] < statePriority[b.state]) return -1
      return 0
    })

    // Actualizar los datos
    setData(newData)
  }, [exchangers])

  return (
    <Card>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: '0.75rem' }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Cantidad de intercambiadores por género
        </Typography.Title>
        <Button
          type={stack ? 'primary' : 'default'}
          size="small"
          style={{ width: '6.25rem' }}
          onClick={() => setStack(!stack)}
          disabled={isLoading}
        >
          {stack ? 'Agrupado' : 'Desagrupado'}
        </Button>
      </Flex>

      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : (
        <Column
          loading={isLoading}
          data={data}
          xField="gender"
          yField="amount"
          height={600}
          seriesField={stack ? [] : 'state'}
          stack={{
            groupBy: ['x', 'series'],
            series: true,
          }}
          colorField="state"
          scale={{ color: { palette: 'category10' } }}
        />
      )}
    </Card>
  )
}
