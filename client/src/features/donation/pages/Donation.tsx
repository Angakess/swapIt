import { PageTitle } from '@Common/components'
import {
  AmountChoice,
  FormMercadoPago,
  MyStatusScreen,
} from '@Donation/components'
import { Flex, Spin } from 'antd'
import { useState } from 'react'

export function Donation() {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<number | null>(100)
  const [paymentResponse, setPaymentResponse] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <PageTitle title="Colaborá con Cáritas"></PageTitle>
      <Spin spinning={loading}>
        <Flex vertical gap={'middle'}>
          <>
            {paymentResponse ? (
              <MyStatusScreen paymentId={paymentResponse.id} />
            ) : (
              <>
                {showForm ? ( 
                  <FormMercadoPago
                    monto={amount!}
                    setPaymentResponse={setPaymentResponse}
                    setLoading={setLoading}
                    setShowForm={setShowForm}
                  ></FormMercadoPago>
               ) : ( 
                  <AmountChoice
                    amount={amount}
                    setAmount={setAmount}
                    setShowForm={setShowForm}
                  ></AmountChoice>
               )} 
              </>
            )}
          </>
        </Flex>
      </Spin>
    </>
  )
}
