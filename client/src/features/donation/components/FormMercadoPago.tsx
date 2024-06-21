import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'

initMercadoPago('TEST-b1345bc2-e375-4feb-bf82-951baf133630')

export function FormMercadoPago({monto} : {monto:number}) {

  const initialization = {
    amount: monto,
    items: {
      totalItemsAmount: monto,
      itemsList: [
        {
          units: 1,
          value: monto,
          name: "Donacion",
          description: "Donacion a Caritas", // opcional
        },
      ],
    },
  }

  const onSubmit = async (formData: any) => {
    // callback llamado al hacer clic en el botón enviar datos
    console.log("la data",formData)
  }

  const onError = async (error: any) => {
    // callback llamado para todos los casos de error de Brick
    console.log("este es un error",error)
  }

  const onReady = async () => {
    /*
          Callback llamado cuando Brick está listo.
          Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
        */
  }

  return (
    <>
      <CardPayment
        initialization={initialization}
        locale="es-AR"
        customization={{
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
