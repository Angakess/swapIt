import { useEffect, useState } from 'react'
import { Button, Card, Flex, Spin, Statistic, Typography } from 'antd'
import { Column } from '@ant-design/charts'

import {
  CategoryModel,
  PostModel,
  PostStateNameEnum,
  PostStateNames,
} from '@Common/api'

type StatCategoriesColumnProps = {
  isLoading: boolean
  posts: PostModel[]
  categories: CategoryModel[]
}

export function StatCategoriesColumn({
  isLoading,
  posts,
  categories,
}: StatCategoriesColumnProps) {
  type DataType = {
    category: string
    state: PostStateNames
    amount: number
  }

  const [stack, setStack] = useState(true)
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    if (isLoading) return

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
  }, [categories, isLoading, posts])

  return (
    <Card>
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
          disabled={isLoading || data.length === 0}
        >
          {stack ? 'Agrupado' : 'Desagrupado'}
        </Button>
      </Flex>

      {isLoading || data.length === 0 ? (
        <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
      ) : (
        <>
          <CategoriesStatistics
            categories={categories}
            posts={posts}
            isLoading={isLoading}
          />

          <Column
            loading={isLoading || data.length === 0}
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
        </>
      )}
    </Card>
  )
}

type CategoriesStatisticsProps = {
  isLoading: boolean
  posts: PostModel[]
  categories: CategoryModel[]
}

function CategoriesStatistics({
  posts,
  categories,
  isLoading,
}: CategoriesStatisticsProps) {
  type DataType = { [category: string]: number }

  const [data, setData] = useState<DataType>({})

  useEffect(() => {
    if (isLoading) return

    const newData = categories.reduce((acc, { name: category }) => {
      acc[category] = posts.filter((p) => p.category.name === category).length
      return acc
    }, {} as DataType)
    setData(newData)
  }, [categories, isLoading, posts])

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={36}
      style={{
        textTransform: 'capitalize',
        overflowX: 'auto',
        margin: '1.5rem 0.25rem',
      }}
    >
      <Statistic
        title="Total"
        value={Object.values(data).reduce((acc, curr) => acc + curr, 0)}
        style={{ minWidth: 'fit-content', fontWeight: 700 }}
        loading={isLoading || data.length === 0}
      />
      {Object.entries(data).map(([category, amount]) => (
        <Statistic
          key={category}
          title={category}
          value={amount}
          style={{ minWidth: 'fit-content' }}
          loading={isLoading || data.length === 0}
        />
      ))}
    </Flex>
  )
}
