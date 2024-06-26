import { PostListItem, PostUser } from '@Posts/components'
import { Button, Card, Col, Flex, Input, Modal, Row, Space, Spin } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { ButtonConfirmSwap } from '@Swaps/components/ButtonConfirmSwap'
import { useEffect, useState } from 'react'
import { ButtonRejectSwap } from '@Swaps/components/ButtonRejectSwap'
import { useNavigate } from 'react-router-dom'
import { PostModel } from '@Common/api'
import { useCustomAlerts } from '@Common/hooks'

type SwapType = {
  id: number
  post_maker: PostModel
  post_receive: PostModel
}
export function Swap() {

  const miniModal = useCustomAlerts()

  const parts = window.location.href.split('/')
  const swapId: number = parseInt(parts[parts.length - 1])

  const gutter = 32

  const [existe, setExiste] = useState(true)
  const navigate = useNavigate()

  const [confirmDisabled, setConfirmDisabled] = useState(true)
  const [data, setData] = useState<SwapType | null>(null)
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

  //-------------------------------------------------------------

  async function fetchData() {

    setLoading(true)
   
      const res = await fetch(`http://localhost:8000/turns/detail/${swapId}`)
      const result = await res.json()

      setData(result)
      setLoading(false)
  


    /* const res = await fetch(`http://localhost:8000/turns/detail/${swapId}`)
    const result = await res.json()
    setData(result)
    setLoading(false) */
  }

  useEffect(() => {
    fetchData()
  }, [])

  //-------------------------------------------------------------

    return (
      <>
        {/* {!existe ? (
          <Modal
            open={true}
            centered
            closable={false}
            okButtonProps={{ hidden: true, disabled: true }}
            cancelButtonProps={{ hidden: true, disabled: true }}
          >
            <Flex justify="center">
              <p style={{ fontSize: '20px' }}>Este trueque ha sido finalizado</p>
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
        ) : null} */}

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
                      thisId={swapId}
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
                {data ? (
                  <PostUser
                    userId={data.post_maker.user.id}
                    firstName={data.post_maker.user.first_name}
                    lastName={data.post_maker.user.last_name}
                  ></PostUser>
                ) : null}
              </Col>
              <Col span={10} offset={2}>
                {data && (
                  <PostUser
                  userId={data.post_receive.user.id}
                    firstName={data.post_receive.user.first_name}
                    lastName={data.post_receive.user.last_name}
                  ></PostUser>
                )}
              </Col>
            </Row>
            <Row
              gutter={gutter}
              align="middle"
              justify="center"
              style={{ marginBottom: '20px' }}
            >
              <Col span={10}>
                {data && <PostListItem post={data.post_maker}></PostListItem>}
              </Col>
              <Col span={2}>
                <SwapOutlined style={{ fontSize: '32px' }} />
              </Col>
              <Col span={10}>
                {data && <PostListItem post={data.post_receive}></PostListItem>}
              </Col>
            </Row>
            <Row justify="start" style={{ marginBottom: '0px' }}></Row>
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