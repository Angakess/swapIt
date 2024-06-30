import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Flex,
  Rate,
  Row,
  Spin,
  Tooltip,
  Typography,
  theme,
} from 'antd'

import { RatingModel, getUncheckedRatings } from '@Common/api'
import { PageTitle } from '@Common/components'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function Ratings() {
  const [ratings, setRatings] = useState<RatingModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const r = await getUncheckedRatings()
      setRatings(r)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <PageTitle title="Calificaciones" />

      <Flex gap="0.25rem" align="baseline">
        <Typography.Title level={3}>
          Validar calificaiones pendientes
        </Typography.Title>
        <Tooltip
          placement="bottom"
          title="Al rechazar una calificación se mantendrá su valoración, pero se eliminará su comentario."
        >
          <InfoCircleOutlined />
        </Tooltip>
      </Flex>
      <Typography.Paragraph></Typography.Paragraph>
      <RatingContent ratings={ratings} isLoading={isLoading} />
    </>
  )
}

function RatingContent({
  ratings,
  isLoading,
}: {
  ratings: RatingModel[]
  isLoading: boolean
}) {
  const { colorSuccess } = theme.useToken().token

  if (isLoading) {
    return <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
  }

  if (ratings.length === 0) {
    return <Empty description="No hay calificaciones pendientes de revisión" />
  }

  return ratings.map((rating) => (
    <Card key={rating.id} style={{ marginBottom: '1rem' }}>
      <Flex vertical gap={'1rem'}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={15}>
            <RatingAvatar {...rating} />
          </Col>
          <Col xs={24} md={9} style={{ justifySelf: 'end' }}>
            <Flex gap="0.75rem">
              <ConfigProvider theme={{ token: { colorPrimary: colorSuccess } }}>
                <Button type="primary" icon={<CheckOutlined />} block>
                  Aceptar
                </Button>
              </ConfigProvider>
              <Button type="primary" danger icon={<CloseOutlined />} block>
                Rechazar
              </Button>
            </Flex>
          </Col>
        </Row>
        <Typography.Paragraph style={{ margin: 0 }}>
          {rating.comment}
        </Typography.Paragraph>
      </Flex>
    </Card>
  ))
}

function RatingAvatar({
  score,
  user_maker: { id, first_name, last_name },
}: RatingModel) {
  const { colorText } = theme.useToken().token

  return (
    <Flex gap="1rem" align="center">
      <Avatar style={{ backgroundColor: '#D02F4C' }} size="large">
        {(first_name[0] + last_name[0]).toUpperCase()}
      </Avatar>
      <Flex vertical>
        <Link
          to={`/admin/exchangers/${id}`}
          style={{ color: colorText, fontWeight: 700 }}
        >
          {first_name} {last_name}
        </Link>
        <Rate disabled defaultValue={score} allowHalf />
      </Flex>
    </Flex>
  )
}
