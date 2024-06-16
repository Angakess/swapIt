import { useEffect, useState } from 'react'
import { SubsidiaryModel, getSubsidiaries } from '@Common/api'
import { PageTitle } from '@Common/components'
import { Space } from 'antd'
import { ColumnHelpersPerSubsidiary } from '@Stats/components/subsidiaries'

export function StatsSubsidiaries() {
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      setSubsidiaries(await getSubsidiaries())
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Estadísticas de filiales" />

      <Space direction="vertical" size={[24, 24]} style={{ display: 'flex' }}>
        <ColumnHelpersPerSubsidiary
          isLoading={isLoading}
          subsidiaries={subsidiaries}
        />
      </Space>
    </>
  )
}
