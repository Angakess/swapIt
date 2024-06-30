import { Empty, Space, Spin } from 'antd'
import { useEffect, useState } from 'react'

import { ExchangerModel, getExchangersList } from '@Common/api'
import { PageTitle } from '@Common/components'
import {
  ColumnExchangersPerGender,
  ColumnExchangersPerState,
} from '@Stats/components/exchangers'

export function StatsExchangers() {
  const [exchangers, setExchangers] = useState<ExchangerModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const [e] = await Promise.all([getExchangersList()])
      setExchangers(e)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Estadísticas de intercambiadores" />

      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : exchangers.length === 0 ? (
        <Empty description="No hay intercambiadores disponibles para mostrar estadísticas." />
      ) : (
        <Space direction="vertical" size={[24, 24]} style={{ display: 'flex' }}>
          <ColumnExchangersPerState
            isLoading={isLoading}
            exchangers={exchangers}
          />
          <ColumnExchangersPerGender
            isLoading={isLoading}
            exchangers={exchangers}
          />
        </Space>
      )}
    </>
  )
}
