import { useAuth } from '@Common/hooks'
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'
import {
  ICardPaymentBrickPayer,
  ICardPaymentFormData,
} from '@mercadopago/sdk-react/bricks/cardPayment/type'
import { Button } from 'antd'
import { IdentificationType } from 'mercadopago'
/* import fs from "fs" */
import { PUBLIC_KEY_MP, ACCESS_TOKEN_MP } from 'secure'

/* const PUBLIC_KEY = fs.readFileSync("@Donation/keys/PUBLIC_KEY.txt", "utf-8")
const ACCESS_TOKEN = fs.readFileSync("@Donation/keys/ACCESS_TOKEN.txt", "utf-8") */


initMercadoPago(PUBLIC_KEY_MP)
// initMercadoPago(`TEST-b1345bc2-e375-4feb-bf82-951baf133630`)



export function FormMercadoPago({
  monto,
  setPaymentResponse,
  setLoading,
  setShowForm,
}: {
  monto: number
  setPaymentResponse: (x: any) => void
  setLoading: (x: boolean) => void
  setShowForm: (x: boolean) => void
}) {

  const {user} = useAuth()


  console.log("ALGO")
  const initialization = {
    amount: monto,
  }

  function getRandomKey() {
    const key = crypto.randomUUID()
    return key
  }

  const onSubmit = async (
    formData: ICardPaymentFormData<ICardPaymentBrickPayer>
  ) => {
    const key = getRandomKey()
    // callback llamado al hacer clic en el botón enviar datos
    console.log(formData)
    console.log('key: ', key)
    return new Promise<void>(async () => {
      setLoading(true)

      

      let auxBody = {
        installments: formData.installments,
        issuer_id: formData.issuer_id,
        payer: formData.payer,
        payment_method_id: formData.payment_method_id,
        token: formData.token,
        transaction_amount: formData.transaction_amount,
        additional_info: {
          items: [
            {
              id: "MLB2907679857",
              title: "Donacion",
              description: "Donacion a Caritas (test)",
              category_id: "donation",
              quantity: 1,
              unit_price: formData.transaction_amount,
            }
          ],
          payer: {
            first_name: user?.first_name,
            last_name: user?.last_name,

          }
        }
      }
      
      const res = await fetch(
        // `https://api.mercadopago.com/v1/payments?access_token=TEST-2113004974746683-062116-cb03216f5151358d407bb8abffaee4d3-475995598`,
        `https://api.mercadopago.com/v1/payments?access_token=${ACCESS_TOKEN_MP}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': key,
          },
          /* body: JSON.stringify(formData), */
          body: JSON.stringify(auxBody)
        }
      )
      const response = await res.json()
      console.log('response: ', response)
      setPaymentResponse(response)
      setLoading(false)
    })
  }

  const onError = async (error: any) => {
    // callback llamado para todos los casos de error de Brick
    console.log('este es un error', error)
  }

  const onReady = async () => {
    /*
          Callback llamado cuando Brick está listo.
          Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
        */
  }

  return (
    <>
      <Button type='link' size='large' style={{marginRight:"auto"}} onClick={() => setShowForm(false)}>Volver</Button>
      <CardPayment
        initialization={initialization}
        locale="es-AR"
        customization={{
          paymentMethods: { maxInstallments: 1 },
          visual: {
            hidePaymentButton: false,
            style: {
              customVariables: {
                baseColor: '#14518B',
              },
            },
          },
        }}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </>
  )
}
