import { RequestModel, rejectRequest } from '@Common/api'
import { AcceptRejectButton } from './AcceptRejectButton'
import { CancelButton } from './CancelButton'
import { useState } from 'react'
import { DatePicker, Form, Modal, ModalProps } from 'antd'
import { useCustomAlerts } from '@Common/hooks'
import { useNavigate } from 'react-router-dom'

export function ButtonReceiver({ request }: { request: RequestModel }) {
  const navigate = useNavigate()
  const { successNotification, errorNotification } = useCustomAlerts()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleAccept() {
    console.log('receiver accept')
  }

  async function handleReject() {
    setIsLoading(true)
    const resp = await rejectRequest(request.id)

    if (resp.ok) {
      successNotification(
        'Solicitud rechazada',
        'La solicitud ha sido rechazada correctamente'
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

  async function handleCancel() {
    console.log('receiver cancel')
  }

  if (request.state === 'pendiente') {
    return (
      <>
        <AcceptRejectButton
          disabled={isLoading}
          acceptProps={{ onClick: () => setIsOpen(true) }}
          rejectProps={{ onClick: handleReject }}
        />
        <AcceptModal
          isOpen={isOpen}
          isLoading={isLoading}
          onOk={handleAccept}
          onCancel={() => setIsOpen(false)}
        />
      </>
    )
  }

  if (request.state === 'semi-aceptado') {
    return (
      <CancelButton
        disabled={isLoading}
        cancelProps={{ onClick: handleCancel }}
      />
    )
  }
}

type AcceptModalProps = {
  isOpen: boolean
  isLoading: boolean
  onOk: ModalProps['onOk']
  onCancel: ModalProps['onCancel']
}

function AcceptModal({ isOpen, isLoading, onOk, onCancel }: AcceptModalProps) {
  return (
    <Modal
      title="Aceptar solicitud"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText="Aceptar solicitud"
      cancelText="Cancelar"
    >
      <Form layout="vertical">
        <Form.Item
          label="Fecha del turno"
          help="Seleccione la fecha en la que quiere realizar el turno."
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
