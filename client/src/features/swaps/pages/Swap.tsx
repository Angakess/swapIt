import { PostListItem, PostUser } from '@Posts/components'
import { Button, Card, Col, Flex, Input, Modal, Row, Space, Spin } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { ButtonConfirmSwap } from '@Swaps/components/ButtonConfirmSwap'
import { useEffect, useState } from 'react'
import { ButtonRejectSwap } from '@Swaps/components/ButtonRejectSwap'
import { useNavigate } from 'react-router-dom'

export function Swap() {
  const parts = window.location.href.split('/')
  const swapId: number = parseInt(parts[parts.length - 1])

  const gutter = 32

  const [existe, setExiste] = useState(true)
  const navigate = useNavigate()

  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [inputError, setInputError] = useState<{
    errorStatus: '' | 'error'
    errorMessage: string
  }>({
    errorStatus: '',
    errorMessage: '',
  })
  const [inputCodes, setInputCodes] = useState({
    inputA: '',
    inputB: '',
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputCodes((prevInputCodes) => ({
      ...prevInputCodes,
      [event.target.id]: event.target.value.toUpperCase(),
    }))
  }
  function validateInputs() {
    if (inputCodes.inputA === '' || inputCodes.inputB === '') {
      setInputError({
        errorStatus: 'error',
        errorMessage: 'Ingrese ambos códigos',
      })
      setConfirmDisabled(true)
      return
    }
    setInputError({
      errorStatus: '',
      errorMessage: '',
    })
    setConfirmDisabled(false)
  }
  useEffect(validateInputs, [inputCodes])

  return (
    <>
      {!existe ? (
        <Modal
          open={true}
          centered
          closable={false}
          okButtonProps={{ hidden: true, disabled: true }}
          cancelButtonProps={{ hidden: true, disabled: true }}
        >
          <Flex justify="center">
            <p style={{ fontSize: '20px' }}>Este trueque ha sido eliminado</p>
          </Flex>
          <Flex justify="center">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/', { replace: true })}
            >
              Volver
            </Button>
          </Flex>
        </Modal>
      ) : null}

      <Spin spinning={loading}>
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
                  Efectivización del trueque
                </h3>
                <Space>
                  <ButtonRejectSwap
                    loading={loading}
                    setLoading={setLoading}
                    existe={existe}
                    setExiste={setExiste}
                  ></ButtonRejectSwap>
                  <ButtonConfirmSwap
                    confirmDisabled={confirmDisabled}
                    idTurn={swapId}
                    inputCodes={inputCodes}
                    loading={loading}
                    setLoading={setLoading}
                    existe={existe}
                    setExist={setExiste}
                  ></ButtonConfirmSwap>
                </Space>
              </Flex>
            </>
          }
        >
          <Row
            gutter={gutter}
            align="middle"
            justify="center"
            style={{ marginBottom: '0px' }}
          >
            <Col
              span={10}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <p style={{ fontWeight: 'bold' }}>Ofrecedor</p>
            </Col>
            <Col
              span={10}
              offset={2}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <p style={{ fontWeight: 'bold' }}>Ofrecido</p>
            </Col>
          </Row>
          <Row
            gutter={gutter}
            align="middle"
            justify="center"
            style={{ marginBottom: '20px' }}
          >
            <Col span={10}>
              <PostUser firstName="Luciano" lastName="Mercuri"></PostUser>
            </Col>
            <Col span={10} offset={2}>
              <PostUser firstName="Luis" lastName="Urrels"></PostUser>
            </Col>
          </Row>
          <Row
            gutter={gutter}
            align="middle"
            justify="center"
            style={{ marginBottom: '20px' }}
          >
            <Col span={10}>
              <PostListItem
                //cambiar por objeto post
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
                //cambiar por objeto post
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
          <Row justify="start" style={{ marginBottom: '0px' }}>
            {/* <Col>
            <h3
              style={{
                fontWeight: 'bold',
                marginBottom: '10px',
                marginRight: 'auto',
              }}
            >
              Ingrese al menos uno de los códigos:
            </h3>
          </Col> */}
          </Row>
          <Row justify="start">
            <Col offset={1}>
              <p style={{ color: '#FF4D4F' }}>{inputError.errorMessage}</p>
            </Col>
          </Row>
          <Row gutter={gutter} align="middle" justify="center">
            <Col span={10}>
              <Input
                addonBefore="Ofrecedor"
                id="inputA"
                status={inputError.errorStatus}
                value={inputCodes.inputA}
                onChange={(event) => handleChange(event)}
              ></Input>
            </Col>
            <Col span={10} offset={2}>
              <Input
                addonBefore="Ofrecido"
                id="inputB"
                status={inputError.errorStatus}
                value={inputCodes.inputB}
                onChange={(event) => handleChange(event)}
              ></Input>
            </Col>
          </Row>
        </Card>
      </Spin>
      {/*       ) : (
        <>
          <Card>
            <Flex justify="center">
              <p style={{ fontSize: '20px' }}>Este trueque ha sido eliminado</p>
            </Flex>
            <Flex justify="center">
              <Button type='primary' size='large' onClick={() => navigate('/', { replace: true })}>Volver</Button>
            </Flex>
          </Card>
        </>
      )} */}
    </>
  )
}
