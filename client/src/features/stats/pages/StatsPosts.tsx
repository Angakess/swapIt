import {
  CategoryModel,
  PostModel,
  PostStateNameEnum,
  PostStateNames,
  getCategoryList,
  getPostList,
} from '@Common/api'
import { PageTitle } from '@Common/components'
import { Column, Pie } from '@ant-design/charts'
import { Button, Card, Col, Flex, Row, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'

export function StatsPosts() {
  const [posts, setPosts] = useState<PostModel[]>([])
  const [categories, setCategories] = useState<CategoryModel[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const [c, p] = await Promise.all([getCategoryList(), getPostList()])
      setCategories(c)
      setPosts(p)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Estadísticas de publicaciones" />
      <StatPostColum
        isLoading={isLoading}
        categories={categories}
        posts={posts}
      />
      <Row gutter={[12, 12]}>
        {isLoading ? (
          <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
        ) : (
          categories.map((category) => (
            <Col xs={24} md={12}>
              <CategoryPie
                key={category.name}
                category={category.name}
                posts={posts}
                isLoading={isLoading}
              />
            </Col>
          ))
        )}
      </Row>
    </>
  )
}

type StatPostColumProps = {
  isLoading: boolean
  posts: PostModel[]
  categories: CategoryModel[]
}

function StatPostColum({ isLoading, posts, categories }: StatPostColumProps) {
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

type CategoryPieProps = {
  isLoading: boolean
  category: string
  posts: PostModel[]
}

function CategoryPie({ isLoading, category, posts }: CategoryPieProps) {
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
              render: (e, { title, items }) => {
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
