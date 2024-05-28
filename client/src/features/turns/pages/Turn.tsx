import { ButtonCancelarTurno } from '@Turns/components/ButtonCancelarTurno'
import { CalendarTurn } from '@Turns/components/CalendarTurn'
import { MapWithTurn } from '@Turns/components/MapWithTurn'
import { ModalCancelarTurno } from '@Turns/components/ModalCancelarTurno'
import { Button, Card, Col, Flex, Row, Space } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { PostListItem } from '@Posts/components'

export function Turn() {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [turnSelected, setTurnSelected] = useState({
    id: 0,
    date: '00/00/0000',
    subsidiary: 'asdf qwer',
    confirmed: true,
  })

  function ButtonConfirmTurn() {
    return (
      <>
        <Button type="primary">Confirmar</Button>
      </>
    )
  }
  function ButtonRescheduleTurn() {
    return (
      <>
        <Button>Aplazar</Button>
      </>
    )
  }

  return (
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
                Info del turno
              </h3>
              <Space size={'large'}>
                <ButtonRescheduleTurn></ButtonRescheduleTurn>

                <ButtonCancelarTurno
                  record={{
                    id: 0,
                    date: '00/00/0000',
                    subsidiary: 'asdfqwer',
                    confirmed: true,
                  }}
                  setModalOpen={setModalOpen}
                  setTurnSelected={setTurnSelected}
                  buttonText="Cancelar"
                ></ButtonCancelarTurno>

                <ButtonConfirmTurn></ButtonConfirmTurn>
              </Space>
            </Flex>
          </>
        }
      >
        <Row gutter={32} style={{marginBottom: "24px"}}>
          <Col span={12}>
            <h3
              style={{
                fontWeight: 'bold',
                marginBottom: '10px',
                marginRight: 'auto',
              }}
            >
              Fecha del turno: {turnSelected.date}
            </h3>

            <CalendarTurn></CalendarTurn>
          </Col>
          <Col span={12}>
            <h3
              style={{
                fontWeight: 'bold',
                marginBottom: '10px',
                marginRight: 'auto',
              }}
            >
              Filial
            </h3>
            <MapWithTurn
              sub={{
                id: 1,
                name: 'asdf',
                x_coordinate: '-34.8',
                y_coordinate: '-58',
              }}
            ></MapWithTurn>
          </Col>
        </Row>
        <Row style={{marginBottom: "10px"}}>
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
        <Row gutter={32} align="middle" justify="center">
            <Col span={10}>
              <PostListItem
                post={{
                  id: 1,
                  name: 'Camperón de hombre',
                  description:
                    'Camperón XL con bolsillos dentro y forro interior extraíble, excelente estado',
                  value: 4,
                  user: {
                    id: 15,
                    first_name: 'Rena',
                    last_name: 'Longcake',
                    dni: '23309342',
                    email: 'rlongcakef@yopmail.com',
                    role: 'EXCHANGER',
                    state: {
                      name: 'activo',
                    },
                  },
                  subsidiary: {
                    id: 3,
                    name: 'Nuestra Señora de la Salud',
                    x_coordinate: '-34.95504757897488',
                    y_coordinate: '-57.965366660497864',
                    max_helpers: 3,
                    cant_current_helpers: 1,
                    active: true,
                  },
                  state: {
                    id: 2,
                    name: 'pendiente',
                  },
                  category: {
                    id: 2,
                    name: 'vestimenta',
                    active: true,
                  },
                  state_product: 'USADO',
                  stock_product: 1,
                  image_1:
                    'http://localhost:8000/media/post_images/post1_img1.jpg',
                  image_2:
                    'http://localhost:8000/media/post_images/post1_img2.jpg',
                  image_3:
                    'http://localhost:8000/media/post_images/post1_img3.jpg',
                  image_4:
                    'http://localhost:8000/media/post_images/post1_img4.jpg',
                  image_5:
                    'http://localhost:8000/media/post_images/post1_img5.jpg',
                }}
              ></PostListItem>
            </Col>
            <Col span={2}>
              <SwapOutlined style={{ fontSize: '32px' }} />
            </Col>
            <Col span={10}>
              <PostListItem
                post={{
                  id: 1,
                  name: 'Camperón de hombre',
                  description:
                    'Camperón XL con bolsillos dentro y forro interior extraíble, excelente estado',
                  value: 4,
                  user: {
                    id: 15,
                    first_name: 'Rena',
                    last_name: 'Longcake',
                    dni: '23309342',
                    email: 'rlongcakef@yopmail.com',
                    role: 'EXCHANGER',
                    state: {
                      name: 'activo',
                    },
                  },
                  subsidiary: {
                    id: 3,
                    name: 'Nuestra Señora de la Salud',
                    x_coordinate: '-34.95504757897488',
                    y_coordinate: '-57.965366660497864',
                    max_helpers: 3,
                    cant_current_helpers: 1,
                    active: true,
                  },
                  state: {
                    id: 2,
                    name: 'pendiente',
                  },
                  category: {
                    id: 2,
                    name: 'vestimenta',
                    active: true,
                  },
                  state_product: 'USADO',
                  stock_product: 1,
                  image_1:
                    'http://localhost:8000/media/post_images/post1_img1.jpg',
                  image_2:
                    'http://localhost:8000/media/post_images/post1_img2.jpg',
                  image_3:
                    'http://localhost:8000/media/post_images/post1_img3.jpg',
                  image_4:
                    'http://localhost:8000/media/post_images/post1_img4.jpg',
                  image_5:
                    'http://localhost:8000/media/post_images/post1_img5.jpg',
                }}
              ></PostListItem>
            </Col>
          </Row>
      </Card>

      <ModalCancelarTurno
        turnEstate={turnSelected?.confirmed}
        loading={loading}
        setLoading={setLoading}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      ></ModalCancelarTurno>
    </>
  )
}
