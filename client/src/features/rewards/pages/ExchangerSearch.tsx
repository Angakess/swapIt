import { PageTitle } from '@Common/components'
import { Button, Col, Form, Input, Modal, Row, Space, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { CategoryList, ExchangerInfo } from '@Rewards/components'
import { Exchanger } from '@Rewards/types'
import { useAuth } from '@Common/hooks'
import { SearchOutlined } from '@ant-design/icons'

export function ExchangerSearch() {
  const { user } = useAuth()

  /* const [inputValue, setInputValue] = useState<string>() */
  const [form] = Form.useForm<{ dni: string }>()
  const [loading, setLoading] = useState(false)
  const [newData, setNewData] = useState<Exchanger>()

  async function handleSearch(values: { dni: string }) {
    setLoading(true)
    const res = await fetch(
      `http://localhost:8000/users/get-exchanger-dni/${values.dni}`
    )
    if (res.ok) {
      const result = await res.json()
      setNewData(result.data)
    } else {
      setNewData(undefined)
      if (res.status === 404) {
        Modal.error({
          title: 'Ocurrió un error',
          content: `No existe un intercambiador con el DNI ingresado`,
        })
      } else {
        Modal.error({
          title: 'Ocurrió un error',
          content: ``,
        })
      }
    }
    setLoading(false)
  }

  /*  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
  } */

  const [subId, setSubId] = useState()
  async function fetchSubId() {
    setLoading(true)
    const res = await fetch(
      `http://localhost:8000/users/get-helper/${user?.id}`
    )
    const result = await res.json()
    setSubId(result.subsidiary.id)
    setLoading(false)
  }
  useEffect(() => {
    fetchSubId()
  }, [])

  return (
    <>
      <Spin spinning={loading}>
        <PageTitle title="Canje de puntos"></PageTitle>

        <Row gutter={20}>
          <Col
            span={11}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              marginRight: '20px',
              height: '100%',
            }}
          >
            <Form
              form={form}
              layout="vertical"
              style={{ padding: '10px' }}
              onFinish={handleSearch}
            >
              <Form.Item
                label="Ingrese el DNI del intercambiador que desea realizar un canje"
                name="dni"
                required={false}
                rules={[
                  {
                    required: true,
                    message:
                      'Ingrese un DNI',
                  },
                  { len: 8, message: 'El DNI debe ser de 8 dígitos' },
                  { pattern: /^\d+$/, message: 'El DNI debe ser un número' },
                ]}
              >
                <Space.Compact block>
                  <Input
                    placeholder="DNI"
                    size="large"
                    style={{ width: '100%' }}
                    autoFocus
                  />
                  <Button
                    htmlType="submit"
                    size="large"
                    type="primary"
                    icon={<SearchOutlined />}
                  >Buscar</Button>
                </Space.Compact>
              </Form.Item>
            </Form>

            {/* <Search
              value={inputValue}
              autoFocus
              placeholder="Ingrese un DNI"
              size="large"
              onChange={(e) => handleChange(e)}
              onSearch={handleSearch}
              enterButton={'Buscar'}
              style={{ marginBottom: '24px', marginTop: '24px' }}
              
            ></Search> */}
            {newData ? (
              <ExchangerInfo userData={newData}></ExchangerInfo>
            ) : /* (
              <p style={{ color: '#FF6466' }}>
                Ingrese el DNI del intercambiador que desea realizar un canje
              </p>
            ) */ null}
          </Col>
          <Col
            span={11}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              height: '535px',
            }}
          >
            <h2
              style={{
                marginBottom: '24px',
                marginTop: '24px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '5px',
              }}
            >
              Categorías
            </h2>
            {subId && (
              <CategoryList
                hasUser={newData ? true : false}
                subId={subId}
                userPoints={newData?.score}
                user={newData}
                handleSearch={handleSearch}
                fetchSubId={fetchSubId}
              ></CategoryList>
            )}
          </Col>
        </Row>
      </Spin>
    </>
  )
}
