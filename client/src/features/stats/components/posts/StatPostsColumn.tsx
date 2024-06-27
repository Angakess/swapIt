import {
  CategoryModel,
  PostModel,
  PostStateNameEnum,
  PostStateNames,
} from '@Common/api'
import { Column } from '@ant-design/charts'
import { Button, Card, Flex, Spin, Statistic, Typography } from 'antd'
import { useEffect, useState } from 'react'

type StatPostsColumnProps = {
  isLoading: boolean
  categories: CategoryModel[]
  posts: PostModel[]
}

type DataType = {
  category: string
  state: PostStateNames
  amount: number
}

const states: PostStateNames[] = Object.values(PostStateNameEnum)

export function StatPostsColumn({
  isLoading,
  posts,
  categories,
}: StatPostsColumnProps) {
  const [stack, setStack] = useState(true)
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    if (isLoading) return

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
          Cantidad de publicaciones por estado
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
          <StateStatistics posts={posts} isLoading={isLoading} />

          <Column
            loading={isLoading || data.length === 0}
            data={data}
            xField="state"
            yField="amount"
            height={500}
            seriesField={stack ? [] : 'category'}
            stack={{
              groupBy: ['x', 'series'],
              series: true,
            }}
            colorField="category"
            scale={{ color: { palette: 'category10' } }}
          />
        </>
      )}
    </Card>
  )
}

type StateStatisticsProps = {
  isLoading: boolean
  posts: PostModel[]
}

function StateStatistics({ posts, isLoading }: StateStatisticsProps) {
  type StateStatisticData = { [state: string]: number }

  const [data, setData] = useState<StateStatisticData | Record<string, never>>(
    {}
  )

  useEffect(() => {
    if (isLoading) return

    const newData = states.reduce((acc, state) => {
      acc[state] = posts.filter((p) => p.state.name === state).length
      return acc
    }, {} as StateStatisticData)
    setData(newData)
  }, [isLoading, posts])

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
      {Object.entries(data).map(([state, amount]) => (
        <Statistic
          key={state}
          title={state}
          value={amount}
          style={{ minWidth: 'fit-content' }}
          loading={isLoading || data.length === 0}
        />
      ))}
    </Flex>
  )
}
