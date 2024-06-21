import { Button, Card, Flex, Input, InputNumber, Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib'
import { useState } from 'react'

export function AmountChoice({
  amount,
  setAmount,
}: {
  amount: number
  setAmount: (x: number) => void
}) {
  const [radioValue, setRadioValue] = useState(100)

  const onRadioChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
    setRadioValue(e.target.value)
    setAmount(e.target.value)
  }

  const onInputChange = (e: number | null) => {
    console.log(e)
    if(e){
      setAmount(e)
    }
    else{
      setAmount(1)
    }
  }

  return (
    <>
      <Card title={<p style={{fontSize:"19px", color:"#1A1A1A", marginBottom:"0"}}>Seleccione un monto a donar</p>} styles={{header:{paddingLeft:"18px"}}}>
        <Flex vertical justify="center" align="center" gap="large">
          <Radio.Group
            defaultValue={100}
            buttonStyle="solid"
            onChange={onRadioChange}
            value={radioValue}
            size="large"
            style={{ width: '100%' }}
          >
            <Radio.Button
              value={100}
              style={{ width: '20%', textAlign: 'center' }}
            >
              $100
            </Radio.Button>
            <Radio.Button
              value={500}
              style={{ width: '20%', textAlign: 'center' }}
            >
              $500
            </Radio.Button>
            <Radio.Button
              value={1000}
              style={{ width: '20%', textAlign: 'center' }}
            >
              $1000
            </Radio.Button>
            <Radio.Button
              value={2000}
              style={{ width: '20%', textAlign: 'center' }}
            >
              $2000
            </Radio.Button>
            <Radio.Button
              value={1}
              style={{ width: '20%', textAlign: 'center' }}
            >
              Otro
            </Radio.Button>
          </Radio.Group>
          {radioValue === 1 ? (
            <InputNumber
              onChange={(e) => onInputChange(e)}
              size="large"
              min={1}
              placeholder="Ingrese un monto"
              style={{ width: '100%' }}
              value={amount}
            />
          ) : null}
        </Flex>
        <Button size='large' type='primary' style={{display:"flex",marginLeft:"auto", marginTop: "24px"}}>Confirmar</Button>
      </Card>
    </>
  )
}
