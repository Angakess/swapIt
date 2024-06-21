import { PageTitle } from '@Common/components'
import { AmountChoice, FormMercadoPago } from '@Donation/components'
import { Button, Flex, Progress, Space } from 'antd'
import { useState } from 'react'

export function Donation() {
  /* const [step, setStep] = useState<number>(0) */
  const [amount, setAmount] = useState<number>(100)

  return (
    <>
      <PageTitle title="Colaborá con Cáritas"></PageTitle>
      <Flex vertical gap={'middle'}>
        {/* <Progress
          percent={step === 3 ? 100 : 33 * step}
          showInfo={false}
          status={step === 3 ? 'success' : 'active'}
        ></Progress> */}
        <>
          <AmountChoice amount={amount} setAmount={setAmount}></AmountChoice>
          <FormMercadoPago monto={amount}></FormMercadoPago>
        </>
        {/* <Flex justify="end" gap={'middle'}>
          {step > 0 ? (
            <Button size="large" type="link" onClick={() => setStep(step - 1)}>
              Volver
            </Button>
          ) : null}

          <Button size="large" type="primary" onClick={() => setStep(step + 1)}>
            Confirmar
          </Button>
        </Flex> */}
      </Flex>
    </>
  )
}
