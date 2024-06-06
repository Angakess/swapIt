import {
  RequestModel,
  acceptRequest,
  cancelRequest,
  rejectRequest,
} from '@Common/api'
import { AcceptRejectButton } from './AcceptRejectButton'
import { CancelButton } from './CancelButton'
import { useState } from 'react'
import { DatePicker, Form, Modal, ModalProps, Typography } from 'antd'
import { useCustomAlerts } from '@Common/hooks'
import { useNavigate } from 'react-router-dom'
import dayjs, { Dayjs } from 'dayjs'

type ButtonReceiverProps = {
  request: RequestModel
  setRequest: React.Dispatch<React.SetStateAction<RequestModel | null>>
}

export function ButtonReceiver({ request, setRequest }: ButtonReceiverProps) {
  const navigate = useNavigate()
  const { successNotification, errorNotification } = useCustomAlerts()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleAccept(date: Dayjs) {
    setIsLoading(true)

    const resp = await acceptRequest(request.id, date)

    if (resp.ok) {
      successNotification('Solicitud aceptada', 'Solicitud aceptada con éxito')
      setRequest(resp.data.request)
    } else {
      errorNotification('Ocurrió un error', resp.messages.join('\n'))
    }

    setIsOpen(false)
    setIsLoading(false)
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
      <>
        <AcceptRejectButton
          disabled={isLoading}
          acceptProps={{ onClick: () => setIsOpen(true) }}
          rejectProps={{ onClick: handleReject }}
        />
        <AcceptModal
          isOpen={isOpen}
          isLoading={isLoading}
          onFinish={handleAccept}
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
  onFinish: (date: Dayjs) => void
  onCancel: ModalProps['onCancel']
}

function AcceptModal({
  isOpen,
  isLoading,
  onFinish,
  onCancel,
}: AcceptModalProps) {
  const [form] = Form.useForm<{ date: Dayjs }>()

  return (
    <Modal
      title="Aceptar solicitud"
      open={isOpen}
      onOk={form.submit}
      onCancel={onCancel}
      confirmLoading={isLoading}
      okText="Aceptar solicitud"
      cancelText="Cancelar"
    >
      <Typography.Paragraph type="secondary">
        Seleccione la fecha en la que quiere realizar el turno.
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary" style={{ marginBottom: '1.5rem' }}>
        Cuando el otro usuario acepte el turno, se les enviará un correo a ambos
        para que puedan coordinar el horario del encuentro.
      </Typography.Paragraph>

      <Form
        layout="vertical"
        form={form}
        onFinish={({ date }) => onFinish(date)}
      >
        <Form.Item
          label="Fecha del turno"
          name="date"
          rules={[
            () => ({
              validator(_, value) {
                const date: Dayjs | undefined = value

                if (!date) {
                  return Promise.reject(
                    'Por favor ingrese una fecha para el turno'
                  )
                }

                if (date.day() !== 0 && date.day() !== 6) {
                  return Promise.reject(
                    'La fecha para el turno debe ser un sábado o domingo'
                  )
                }

                return Promise.resolve()
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={(current) =>
              current && current.day() !== 0 && current.day() !== 6
            }
            minDate={dayjs().add(1, 'day')}
            maxDate={dayjs().add(3, 'month')}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
