import { useEffect, useState } from 'react'
import { Card, Spin, Typography } from 'antd'
import { Pie } from '@ant-design/charts'

import { PostModel, PostStateNameEnum, PostStateNames } from '@Common/api'

type CategoryPieProps = {
  isLoading: boolean
  category: string
  posts: PostModel[]
}
export function CategoryPie({ isLoading, category, posts }: CategoryPieProps) {
  type DataType = {
    state: PostStateNames
    amount: number
  }

  const [data, setData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const states: PostStateNames[] = Object.values(PostStateNameEnum)
    const newData = states.map((state) => ({
      state,
      amount: posts.filter(
        (p) => p.state.name === state && p.category.name === category
      ).length,
    }))

    setData(newData)
    setTotal(newData.reduce((acc, { amount }) => acc + amount, 0))
  }, [category, posts])

  return (
    <Card style={{ textTransform: 'capitalize' }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {category}
      </Typography.Title>
      {isLoading ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : (
        <Pie
          loading={isLoading}
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
                const name = items[0].name
                const amount =
                  data.find(({ state }) => state === name)?.amount ?? 0
                return `<b>${name}:</b> ${amount} <i>(${((amount * 100) / total).toFixed(2)}%)</i>`
              },
            },
          }}
        />
      )}
    </Card>
  )
}
