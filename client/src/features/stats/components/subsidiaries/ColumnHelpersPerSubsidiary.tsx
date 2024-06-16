import { SubsidiaryModel } from '@Common/api'
import { DualAxes } from '@ant-design/charts'
import { Card, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'

type StatSubsidiariesColumnProps = {
  subsidiaries: SubsidiaryModel[]
  isLoading: boolean
}

export function ColumnHelpersPerSubsidiary({
  subsidiaries,
  isLoading,
}: StatSubsidiariesColumnProps) {
  type DataType = {
    nombre: string
    ayudantes: number
    maximo: number
  }

  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    setData(
      subsidiaries.map(({ name, max_helpers, cant_current_helpers }) => ({
        nombre: name,
        maximo: max_helpers,
        ayudantes: cant_current_helpers,
      }))
    )
  }, [subsidiaries])

  return (
    <Card>
      <Typography.Title level={3}>
        Cantidad de ayudantes por filial
      </Typography.Title>
      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : (
        <DualAxes
          loading={isLoading}
          data={data}
          height={500}
          xField="nombre"
          legend={{
            color: {
              itemMarker: (v: string) => {
                if (v === 'ayudantes') return 'rect'
                return 'smooth'
              },
            },
          }}
          children={[
            {
              type: 'interval',
              yField: 'ayudantes',
              scale: { y: { domainMin: 0 } },
            },
            {
              type: 'line',
              yField: 'maximo',
              scale: { y: { domainMin: 0 } },
              style: { lineWidth: 3 },
              axis: { y: false },
            },
          ]}
        />
      )}
    </Card>
  )
}
