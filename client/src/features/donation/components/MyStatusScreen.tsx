import { StatusScreen } from '@mercadopago/sdk-react'

export function MyStatusScreen({ paymentId }: { paymentId: number }) {
  const initialization = {
    paymentId: `${paymentId}`, // id de pago para mostrar
  }
  const onError = async (error: any) => {
    // callback llamado solicitada para todos los casos de error de Brick
    console.log(error)
  }
  const onReady = async () => {
    /*
          Callback llamado cuando Brick está listo.
          Aquí puede ocultar cargamentos de su sitio, por ejemplo.
        */
  }

  return (
    <>
      <StatusScreen
        initialization={initialization}
        locale="es-AR"
        onReady={onReady}
        onError={onError}
        customization={{
          backUrls: {
            return: 'http://localhost:5173/donation',
          },
          visual: {
            texts: {
              ctaReturnLabel: 'Volver',
              ctaGeneralErrorLabel: 'Volver',
              ctaCardErrorLabel: 'Volver',
            },
          },
        }}
      />
    </>
  )
}
