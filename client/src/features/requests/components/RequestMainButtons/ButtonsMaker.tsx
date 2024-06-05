import { RequestModel, cancelRequestMade } from '@Common/api'
import { CancelButton } from './CancelButton'
import { AcceptRejectButton } from './AcceptRejectButton'
import { useState } from 'react'
import { useCustomAlerts } from '@Common/hooks'
import { useNavigate } from 'react-router-dom'

export function ButtonsMaker({ request }: { request: RequestModel }) {
  const navigate = useNavigate()
  const { successNotification, errorNotification } = useCustomAlerts()
  const [isLoading, setIsLoading] = useState(false)

  function handleAccept() {
    console.log('maker accept')
  }

  function handleReject() {
    console.log('maker reject')
  }

  async function handleCancel() {
    setIsLoading(true)
    const resp = await cancelRequestMade(request.id)

    if (resp.ok) {
      successNotification(
        'Solicitud cancelada',
        'Su solicitud ha sido cancelada correctamente'
      )
      navigate('/requests/my-requests/', { replace: true })
    } else {
      errorNotification(
        'Ocurrió un error',
        'Debido a un error inesperado no hemos podido cancelar su solicitud.\n' +
          'Por favor, inténtelo más tarde.'
      )
    }

    setIsLoading(false)
  }

  if (request.state === 'pendiente') {
    return (
      <CancelButton
        disabled={isLoading}
        cancelProps={{ onClick: handleCancel }}
      />
    )
  }

  if (request.state === 'semi-aceptado') {
    return (
      <AcceptRejectButton
        disabled={isLoading}
        acceptProps={{ onClick: handleAccept }}
        rejectProps={{ onClick: handleReject }}
      />
    )
  }
}
