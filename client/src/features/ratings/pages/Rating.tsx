import {
  TurnDataModel,
  UserModel,
  createRating,
  getTurnData,
} from '@Common/api'
import { PageTitle } from '@Common/components'
import { useAuth, useCustomAlerts } from '@Common/hooks'
import { Page404 } from '@Common/pages'
import { User } from '@Common/types'
import { Button, Card, Form, Input, Rate, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type RatingFormData = {
  score: number
  comment: string
}

function getOwner(data: TurnDataModel, rol: string) {
  // Si el enlace es del usuario que recibió la oferta entonces hago que el user
  // maker de la calificación sea el user del post_receive.
  if (rol === 'R') {
    return {
      user_maker: data.post_receive.user,
      user_received: data.post_maker.user,
    }
  }
  return {
    user_maker: data.post_maker.user,
    user_received: data.post_receive.user,
  }
}

// TODO: validar que el comentario no esté hecho
function validateRatingAccess(
  turn: TurnDataModel | null,
  user: User,
  rol: string
): boolean {
  if (turn === null) return false
  if (rol === 'R' && user!.id === turn.user_received.id) return true
  if (rol === 'M' && user!.id === turn.user_maker.id) return true
  return false
}

export function Rating() {
  const { successNotification, errorNotification } = useCustomAlerts()
  const { user } = useAuth()
  const { rol, id } = useParams()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [turnData, setTurnData] = useState<TurnDataModel | null>(null)
  const [userRateMaker, setUserRateMaker] = useState<UserModel | null>(null)
  const [userRateReceived, setUserRateReceived] = useState<UserModel | null>(
    null
  )

  const [form] = Form.useForm<RatingFormData>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)

      const resp = await getTurnData(parseInt(id!))
      setTurnData(resp)

      if (resp !== null) {
        const { user_maker, user_received } = getOwner(resp, rol!)
        setUserRateMaker(user_maker)
        setUserRateReceived(user_received)
      }

      setIsLoading(false)
    })()
  }, [id, rol])

  const handleSubmit = async (values: RatingFormData) => {
    setIsLoading(true)
    const ok = await createRating({
      score: values.score,
      comment: values.comment,
      userMakerId: userRateMaker!.id,
      userReceivedId: userRateReceived!.id,
    })

    if (ok) {
      successNotification(
        'Calificación creada',
        'La calificación ha sido creada con éxito.'
      )
      navigate('/', { replace: true })
    } else {
      errorNotification(
        'Ocurrió un error',
        'No ha sido posible crear la calificación. Por favor, inténtelo más tarde.'
      )
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return <Spin size="large" style={{ width: '100%', margin: '2.5rem 0' }} />
  }

  if (!validateRatingAccess(turnData, user!, rol!)) {
    return <Page404 />
  }

  return (
    <>
      <PageTitle
        title={`Calificar al usuario ${userRateReceived!.first_name} ${userRateReceived!.last_name}`}
      />
      <Card>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          disabled={isLoading}
        >
          <Typography.Paragraph strong>
            Fecha del trueque {turnData!.day_of_turn}
          </Typography.Paragraph>
          <Form.Item
            name="score"
            label="Calificacion"
            required={false}
            rules={[{ required: true, message: 'Ingrese una calificación' }]}
          >
            <Rate allowHalf style={{ fontSize: '2rem' }} />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comentario"
            required={false}
            rules={[{ required: true, message: 'Ingrese un comentario' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" size="large" htmlType="submit">
              Confirmar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}
