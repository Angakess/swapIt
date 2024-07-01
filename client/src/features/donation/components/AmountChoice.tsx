import { Button, Card, Flex, InputNumber } from 'antd'

export function AmountChoice({
  amount,
  setAmount,
  setShowForm,
}: {
  amount: number
  setAmount: (x: number) => void
  setShowForm: (x: boolean) => void
}) {

  const onInputChange = (e: number | null) => {
    console.log(e)
    if (e) {
      setAmount(e)
    } else {
      setAmount(1)
    }
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
          <p style={{fontSize: "16px", padding:"7px"}}>Ingrese un monto en pesos (ARS)</p>
          <InputNumber
            onChange={(e) => onInputChange(e)}
            size="large"
            min={1}
            placeholder="Ingrese un monto"
            style={{ width: '100%' }}
            value={amount}
          />
          <Button size='large' type='primary' style={{marginLeft:"auto", marginTop:"10px"}} onClick={() => setShowForm(true)}>Confirmar</Button>
        </Flex>
        {/* <Button size='large' type='primary' style={{display:"flex",marginLeft:"auto", marginTop: "24px"}}>Confirmar</Button> */}
      </Card>
    </>
  )
}
