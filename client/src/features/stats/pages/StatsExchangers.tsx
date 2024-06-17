import { ExchangerModel, getExchangersList } from '@Common/api'
import { PageTitle } from '@Common/components'
import { ColumnExchangersPerState } from '@Stats/components/excahngers'
import { Space } from 'antd'
import { useEffect, useState } from 'react'

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

      <Space direction="vertical" size={[24, 24]} style={{ display: 'flex' }}>
        <ColumnExchangersPerState
          isLoading={isLoading}
          exchangers={exchangers}
        />
      </Space>
    </>
  )
}
