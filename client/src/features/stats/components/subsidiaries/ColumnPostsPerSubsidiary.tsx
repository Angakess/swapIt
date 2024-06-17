import { CategoryModel, PostModel, SubsidiaryModel } from '@Common/api'
import { Column } from '@ant-design/charts'
import { Button, Card, Flex, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'

type ColumnPostsPerSubsidiaryProps = {
  isLoading: boolean
  subsidiaries: SubsidiaryModel[]
  posts: PostModel[]
  categories: CategoryModel[]
}

export function ColumnPostsPerSubsidiary({
  isLoading,
  posts,
  subsidiaries,
  categories,
}: ColumnPostsPerSubsidiaryProps) {
  type DataType = {
    category: string
    subsidiary: string
    amount: number
  }

  const [stack, setStack] = useState(true)
  const [data, setData] = useState<DataType[]>([])

  useEffect(() => {
    if (isLoading) return

    const newData: DataType[] = []

    subsidiaries.forEach(({ name: subsidiary }) => {
      // Quedarse con los posts que pertenecen a la filial actual
      const subsidiaryPosts = posts.filter(
        (p) => p.subsidiary.name === subsidiary
      )

      // Contar la cantidad de publicaciones de la filial actual por categoría
      categories.forEach(({ name: category }) => {
        const amount = subsidiaryPosts.filter(
          (p) => p.category.name === category
        ).length

        // Guardar el dato
        newData.push({ category, subsidiary, amount })
      })
    })

    setData(newData)
  }, [categories, isLoading, posts, subsidiaries])

  return (
    <Card>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: '0.75rem' }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Cantidad de publicaciones por filial
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
        <Column
          loading={isLoading || data.length === 0}
          data={data}
          xField="subsidiary"
          yField="amount"
          height={600}
          seriesField={stack ? [] : 'category'}
          stack={{
            groupBy: ['x', 'series'],
            series: true,
          }}
          colorField="category"
          scale={{ color: { palette: 'category10' } }}
        />
      )}
    </Card>
  )
}
