import {
  PostStateModel,
  PostStateNameEnum,
  PostStateNames,
  getCategoryList,
  getPostList,
} from '@Common/api'
import { PageTitle } from '@Common/components'
import { Column } from '@ant-design/charts'
import { Button, Card, Flex, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'

type TempDataStateType = Record<PostStateModel['name'], number>
type TempDataType = Record<string, TempDataStateType>

type DataType = {
  category: string
  state: PostStateNames
  amount: number
}

async function loadData() {
  const [categories, posts] = await Promise.all([
    getCategoryList(),
    getPostList(),
  ])
  const postStates: PostStateNames[] = Object.values(PostStateNameEnum)

  /** Contiene todos los posts agrupados por categoría y estado */
  const data: TempDataType = {}

  // Crear la estructura del objecto con todos los valores en 0
  categories.forEach((category) => {
    data[category.name] = {} as TempDataStateType
    postStates.forEach((state) => (data[category.name][state] = 0))
  })

  // Cargar los posts en la estructura
  posts.forEach((post) => data[post.category.name][post.state.name]++)

  return data
}

async function formatData() {
  return Object.entries(await loadData()).flatMap(([category, states]) =>
    Object.entries(states).map(([state, amount]) => ({
      category,
      state: state as PostStateModel['name'],
      amount: amount,
    }))
  )
}

export function StatsPosts() {
  const [postsData, setPostsData] = useState<DataType[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [stack, setStack] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    formatData().then((data) => {
      setPostsData(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <PageTitle title="Estadísticas de publicaciones" />
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
          >
            {stack ? 'Agrupado' : 'Desagrupado'}
          </Button>
        </Flex>
        {isLoading ? (
          <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
        ) : (
          <Column
            loading={isLoading}
            data={postsData}
            xField="category"
            yField="amount"
            height={500}
            seriesField={stack ? [] : 'state'}
            stack={{
              groupBy: ['x', 'series'],
              series: true,
            }}
            colorField="state"
          />
        )}
      </Card>
    </>
  )
}
