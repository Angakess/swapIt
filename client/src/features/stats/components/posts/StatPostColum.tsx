import { useEffect, useState } from 'react'
import { Button, Card, Flex, Spin, Typography } from 'antd'
import { Column } from '@ant-design/charts'

import {
  CategoryModel,
  PostModel,
  PostStateNameEnum,
  PostStateNames,
} from '@Common/api'

type StatPostColumProps = {
  isLoading: boolean
  posts: PostModel[]
  categories: CategoryModel[]
}

export function StatPostColum({
  isLoading,
  posts,
  categories,
}: StatPostColumProps) {
  type DataType = {
    category: string
    state: PostStateNames
    amount: number
  }

  const [stack, setStack] = useState(true)
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    const states: PostStateNames[] = Object.values(PostStateNameEnum)
    setData(
      categories.flatMap(({ name }) => {
        const categoryPosts = posts.filter((p) => p.category.name === name)
        return states.map((state) => ({
          category: name,
          state,
          amount: categoryPosts.filter((p) => p.state.name === state).length,
        }))
      })
    )
  }, [categories, posts])

  return (
    <Card style={{ marginBottom: '12px' }}>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: '0.75rem' }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Cantidad de publicaciones por categoría
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
          xField="category"
          yField="amount"
          height={500}
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
