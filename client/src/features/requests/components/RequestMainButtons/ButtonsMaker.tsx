import { RequestModel, cancelRequest, confirmRequest } from '@Common/api'
import { CancelButton } from './CancelButton'
import { AcceptRejectButton } from './AcceptRejectButton'
import { useState } from 'react'
import { useCustomAlerts } from '@Common/hooks'
import { useNavigate } from 'react-router-dom'

type ButtonsMakerProps = {
  request: RequestModel
}

export function ButtonsMaker({ request }: ButtonsMakerProps) {
  const navigate = useNavigate()
  const { successNotification, errorNotification } = useCustomAlerts()
  const [isLoading, setIsLoading] = useState(false)

  async function handleAccept() {
    setIsLoading(true)

    const resp = await confirmRequest('accept', request.id, request.user_maker)

    if (resp.ok) {
      successNotification(
        'Solicitud aceptada',
        'Se ha creado un turno para el intercambio'
      )
      navigate(`/turns/my-turns/${resp.data.turn_id}`, { replace: true })
    } else {
      errorNotification('Ocurrió un error', resp.messages.join('\n'))
    }

    setIsLoading(false)
  }

  async function handleReject() {
    setIsLoading(true)

    const resp = await confirmRequest('reject', request.id, request.user_maker)

    if (resp.ok) {
      successNotification(
        'Solicitud rechazada',
        'La solicitud ha sido rechazada correctamente'
      )
      navigate('/requests/my-requests/', { replace: true })
    } else {
      errorNotification('Ocurrió un error', resp.messages.join('\n'))
    }

    setIsLoading(false)
  }

  async function handleCancel() {
    setIsLoading(true)
    const resp = await cancelRequest(request.id)

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
