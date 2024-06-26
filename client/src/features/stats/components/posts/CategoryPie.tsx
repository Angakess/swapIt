import { useEffect, useState } from 'react'
import { Card, Spin, Typography } from 'antd'
import { Pie } from '@ant-design/charts'

import { PostModel, PostStateNameEnum, PostStateNames } from '@Common/api'

type CategoryPieProps = {
  isLoading: boolean
  category: string
  posts: PostModel[]
}

type DataType = {
  state: PostStateNames
  amount: number
}

export function CategoryPie({ isLoading, category, posts }: CategoryPieProps) {
  const [data, setData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (isLoading) return

    const states: PostStateNames[] = Object.values(PostStateNameEnum)
    const newData = states.map((state) => ({
      state,
      amount: posts.filter(
        (p) => p.state.name === state && p.category.name === category
      ).length,
    }))

    setData(newData)
    setTotal(newData.reduce((acc, { amount }) => acc + amount, 0))
  }, [category, isLoading, posts])

  return (
    <Card style={{ textTransform: 'capitalize', height: '100%' }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {category}
      </Typography.Title>
      <PieContent data={data} isLoading={isLoading} total={total} />
    </Card>
  )
}

type PieContentProps = {
  isLoading: boolean
  data: DataType[]
  total: number
}

function PieContent({ isLoading, data, total }: PieContentProps) {
  if (isLoading || data.length === 0) {
    return <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
  }

  if (total === 0) {
    return (
      <Typography.Paragraph
        style={{ textTransform: 'none', marginTop: '0.75rem' }}
      >
        No hay publicaciones con esta categoría
      </Typography.Paragraph>
    )
  }

  return (
    <Pie
      loading={isLoading || data.length === 0}
      data={data}
      angleField="amount"
      colorField="state"
      legend={true}
      height={400}
      innerRadius={0.6}
      scale={{ color: { palette: 'category10' } }}
      style={{
        stroke: '#fff',
        inset: 1,
        radius: 10,
      }}
      interaction={{
        tooltip: {
          //@ts-expect-error _ y items son de tipo any
          render: (_, { items }) => {
            const amount = items[0].value
            const color = items[0].color

            console.log(items)

            return `<span style="color:${color}">&#x25A0;</span> <b>Cantidad:</b> ${amount} <i>(${((amount * 100) / total).toFixed(2)}%)</i>`
          },
        },
      }}
    />
  )
}
