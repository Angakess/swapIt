import { PageTitle } from '@Common/components'
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Input,
  Modal,
  Result,
  Row,
  Spin,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Search from 'antd/es/input/Search'
import { ChangeEventHandler, ReactElement, useState } from 'react'
import { CategoryList, ExchangerInfo, ExchangerList } from '../components'
import dayjs from 'dayjs'
import { Exchanger } from '../types'

export function ExchangerSearch() {
  const [inputValue, setInputValue] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [newData, setNewData] = useState<Exchanger>()
  async function handleSearch() {
    setLoading(true)
    console.log('buscaste: ', inputValue)
    const res = await fetch(
      `http://localhost:8000/users/get-exchanger/${inputValue}`
    )
    if (res.ok) {
      const result = await res.json()
      setNewData(result)
    } else {
      setNewData(undefined)
      if (res.status === 404) {
        Modal.error({
          title: 'Ocurrió un error',
          content: `No existe un intercambiador con el DNI ingresado`,
        })
      } else {
        console.log('Sucedio otro error')
        Modal.error({
          title: 'Ocurrió un error',
          content: ``,
        })
      }
    }
    setLoading(false)
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
    console.log(event.target.value)
  }
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
            <Search
              value={inputValue}
              autoFocus
              placeholder="Ingrese un DNI"
              size="large"
              onChange={(e) => handleChange(e)}
              onSearch={handleSearch}
              enterButton={'Buscar'}
              style={{ marginBottom: '24px', marginTop: '24px' }}
            ></Search>
            {newData ? (
              <ExchangerInfo userData={newData}></ExchangerInfo>
            ) : <p style={{color: "#FF6466"}}>Ingrese el DNI del intercambiador que desea realizar un canje</p>}
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
            <CategoryList hasUser={newData ? true : false}></CategoryList>
          </Col>
        </Row>
      </Spin>
    </>
  )
}
