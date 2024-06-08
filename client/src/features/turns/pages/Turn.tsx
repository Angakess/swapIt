import { CalendarTurn } from '@Turns/components/CalendarTurn'
import { MapWithTurn } from '@Turns/components/MapWithTurn'
import { Card, Col, Flex, Row } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { PostListItem } from '@Posts/components'
import { useAuth } from '@Common/hooks'
import dayjs from 'dayjs'

interface DataType {
  id: number;
  post_maker: {
      id: number;
      name: string;
      description: string;
      value: number;
      user: {
          id: number;
          first_name: string;
          last_name: string;
          dni: string;
          email: string;
          role: string;
          state: {
              name: string;
          };
      };
      subsidiary: {
          id: number;
          name: string;
          x_coordinate: string;
          y_coordinate: string;
          max_helpers: number;
          cant_current_helpers: number;
          active: boolean;
      };
      state: {
          id: number;
          name: | 'activo'
          | 'pendiente'
          | 'suspendido'
          | 'bloqueado'
          | 'eliminado'
          | 'rechazado'
          | 'sin-stock';
      };
      category: {
          id: number;
          name: string;
          active: boolean;
      };
      state_product: 'NUEVO' | 'USADO';
      stock_product: number;
      image_1: string;
      image_2: string;
      image_3: string | null;
      image_4: string | null;
      image_5: string | null;
  };
  post_receive: {
      id: number;
      name: string;
      description: string;
      value: number;
      user: {
          id: number;
          first_name: string;
          last_name: string;
          dni: string;
          email: string;
          role: string;
          state: {
              name: string;
          };
      };
      subsidiary: {
          id: number;
          name: string;
          x_coordinate: string;
          y_coordinate: string;
          max_helpers: number;
          cant_current_helpers: number;
          active: boolean;
      };
      state: {
          id: number;
          name:         | 'activo'
          | 'pendiente'
          | 'suspendido'
          | 'bloqueado'
          | 'eliminado'
          | 'rechazado'
          | 'sin-stock';
      };
      category: {
          id: number;
          name: string;
          active: boolean;
      };
      state_product: 'NUEVO' | 'USADO';
      stock_product: number;
      image_1: string;
      image_2: string;
      image_3: string | null;
      image_4: string | null;
      image_5: string | null;
  };
  day_of_turn: string;
}

export function Turn() {
  const { user } = useAuth()

  const parts = window.location.href.split('/')
  const turnId: number = parseInt(parts[parts.length - 1])
  const [data, setData] = useState<DataType>()
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    setLoading(true)

    const res = await fetch(`http://localhost:8000/turns/detail/${turnId}`)
    const result = await res.json()

    setData(result)

    setLoading(false)
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {data ? (
        <>
          <Card
            title={
              <>
                <Flex align="center" style={{ marginBottom: '0' }}>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '0',
                      marginRight: 'auto',
                    }}
                  >
                    Información del turno
                  </h3>
                </Flex>
              </>
            }
          >
            <Row gutter={32} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <h3
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    marginRight: 'auto',
                  }}
                >
                  Fecha del turno: {data ? dayjs(data.day_of_turn).format("DD/MM/YYYY") : ''}
                </h3>

                <CalendarTurn date={data?.day_of_turn}></CalendarTurn>
              </Col>
              <Col span={12}>
                <h3
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    marginRight: 'auto',
                  }}
                >
                  Filial: {`${data.post_receive.subsidiary.name}`}
                </h3>
                {data ? (
                  <MapWithTurn
                    sub={{
                      id: data.post_receive.subsidiary.id,
                      name: `${data.post_receive.subsidiary.name}`,
                      x_coordinate: `${data.post_receive.subsidiary.x_coordinate}`,
                      y_coordinate: `${data.post_receive.subsidiary.y_coordinate}`,
                    }}
                  ></MapWithTurn>
                ) : null}
              </Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              <Col>
                <h3
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    marginRight: 'auto',
                  }}
                >
                  Productos involucrados:
                </h3>
              </Col>
            </Row>

            <Row gutter={32} align="middle">
              <Col
                offset={4}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <p style={{ fontWeight: 'bold' }}>Mi publicación</p>
              </Col>
            </Row>

            <Row gutter={32} align="middle" justify="center">
              <Col span={10}>
                <PostListItem post={user?.id == data.post_maker.user.id ? data.post_maker : data.post_receive}></PostListItem>
              </Col>
              <Col span={2}>
                <SwapOutlined style={{ fontSize: '32px' }} />
              </Col>
              <Col span={10}>
                <PostListItem post={user?.id == data.post_maker.user.id ? data.post_receive : data.post_maker}></PostListItem>
              </Col>
            </Row>
          </Card>
        </>
      ) : null}
    </>
  )
}
