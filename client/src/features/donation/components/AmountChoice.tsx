import { Button, Card, Flex, Input, InputNumber } from 'antd'
import { useState } from 'react'

interface ErrorType {
  status: '' | 'warning' | 'error' | undefined
  msg: string
}

export function AmountChoice({
  amount,
  setAmount,
  setShowForm,
}: {
  amount: number | null
  setAmount: (x: number | null) => void
  setShowForm: (x: boolean) => void
}) {
  const [disabledButton, setDisableButton] = useState(false)
  const [error, setError] = useState<ErrorType>({ status: '', msg: '' })

  const onInputChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    console.log(value)
    const v = value.target.value
    /* const sign = v.charAt(0)
    if(sign === "-"){
      const negNumber = v.slice(1)
      if(!/^\d*$/.test(negNumber)){
        setDisableButton(true)
        setError({ status: 'error', msg: 'El monto debe ser positivo' })
        return
      }
      return
    } */

    if (!/^\d*$/.test(v)) {
      setDisableButton(true)
      setError({ status: 'error', msg: 'Ingrese un monto válido' })

      return
    }
    if (v == '') {
      setDisableButton(true)
      setError({ status: 'error', msg: 'Ingrese un monto válido' })
      setAmount(null)
      return
    }
    const vNumber = Number(v)

    if (vNumber <= 0) {
      setDisableButton(true)
      setError({ status: 'error', msg: 'Ingrese un monto válido' })
      setAmount(vNumber)
      return
    }
    setDisableButton(false)
    setError({ status: '', msg: '' })
    setAmount(vNumber)
    return
  }

  return (
    <>
      <Card
        title={
          <p style={{ fontSize: '19px', color: '#1A1A1A', marginBottom: '0' }}>
            Seleccione un monto a donar
          </p>
        }
        styles={{ header: { paddingLeft: '18px' } }}
      >
        <Flex vertical justify="start" align="start" gap="small">
          <p style={{ fontSize: '16px', padding: '7px' }}>
            Ingrese un monto en pesos (ARS)
          </p>
          <Input
            /* defaultValue={100} */
            status={error.status}
            onChange={(e) => onInputChange(e)}
            size="large"
            /* min={1} */
            placeholder="Ingrese un monto"
            style={{ width: '100%' }}
            /* value={amount?.toString()} */
          />
          <p style={{ color: '#FF4D4F' }}>{error.msg}</p>
          <Button
            size="large"
            type="primary"
            style={{ marginLeft: 'auto', marginTop: '10px' }}
            disabled={disabledButton}
            onClick={() => setShowForm(true)}
          >
            Confirmar
          </Button>
        </Flex>
        {/* <Button size='large' type='primary' style={{display:"flex",marginLeft:"auto", marginTop: "24px"}}>Confirmar</Button> */}
      </Card>
    </>
  )
}
