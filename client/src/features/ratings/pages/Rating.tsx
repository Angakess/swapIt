import { Button, Form, Input, Rate, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

async function getTurnData(id: string | undefined) {
  const endpoint = `http://localhost:8000/turns/rating/${id}/`
  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log('[GET TURN DATA][ERROR]', { err }))
}

type RatingFormData = {
  score: number
  comment: string
  user_maker: any
  user_received: any
}

export function Rating() {
  const { rol, id } = useParams()
  const [data, setData] = useState<any | null>(null)
  const [form] = Form.useForm<RatingFormData>()
  const [loading, setLoading] = useState(true)

  const getOwner = (data: any, rol: string) => {
    // Si el enlace es del usuario que recibió la oferta entonces hago que el user maker de la calificación sea el user del post_receive.
    if (rol === 'R')
      return {
        user_maker: data.post_receive.user,
        user_received: data.post_maker.user,
      }
    return {
      user_maker: data.post_maker.user,
      user_received: data.post_receive.user,
    }
  }

  const handleSubmit = async (formData: RatingFormData) => {
    setLoading(true)
    const body = {
      score: formData.score,
      comment: formData.comment,
      user_maker: data.user_maker.id,
      user_received: data.user_received.id,
    }
    fetch(`http://localhost:8000/ratings/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => console.log('[HANDLE SUBMIT][SUCCESS]', { data }))
      .catch((err) => console.log('[HANDLE SUBMIT][ERROR]', { err }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getTurnData(id)
      .then((data) =>{
        console.log('[USE EFFECT][SUCCESS]', { data }) 
        setData({
          ...getOwner(data, rol as string),
          score: 0,
          comment: '',
          day: data.day_of_turn,
        })})
      .catch((err) => console.log('[USE EFFECT][ERROR]', { err }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Spin tip="Cargando..." spinning={loading && !data}>
      {data && (
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          disabled={loading}
        >
          <Typography.Title>
            <h2>
              Calificar al usuario
              {' ' +
                data.user_received.first_name +
                ' ' +
                data.user_received.last_name}
            </h2>
            <h5>Fecha del trueque {data.day}</h5>
          </Typography.Title>
          <Form.Item
            name="score"
            label="Calificacion"
            rules={[{ required: true }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comentario"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" size="large" htmlType="submit">
              Confirmar
            </Button>
          </Form.Item>
        </Form>
      )}
    </Spin>
  )
}
