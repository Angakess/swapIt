import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  Form,
  Modal,
  Popconfirm,
  Row,
  Select,
  theme,
} from 'antd'
import {
  DownOutlined,
  CheckOutlined,
  CloseOutlined,
  UserDeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'

import { useCustomAlerts } from '@Common/hooks'
import { PostModel, moderatePost, putUserInReview } from '@Common/api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function StaffButtons({ post }: { post: PostModel }) {
  const alerts = useCustomAlerts()
  const [isLoading, setIsLoading] = useState(false)

  if (post.state.name === 'activo') {
    return (
      <Button
        type="primary"
        danger
        block
        size="large"
        style={{ fontWeight: '700', marginBottom: '1.5rem' }}
        onClick={alerts.notImplementedYet}
      >
        Dar de baja publicación
      </Button>
    )
  }

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: '1.5rem' }}>
      <Col xs={12}>
        <ApproveButton
          post={post}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Col>

      <Col xs={12}>
        <RejectButton
          post={post}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Col>

      <Col xs={24}>
        <BlockUserButton
          post={post}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Col>
    </Row>
  )
}

type ModerationButtonProps = {
  post: PostModel
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function ApproveButton({
  post,
  isLoading,
  setIsLoading,
}: ModerationButtonProps) {
  const navigate = useNavigate()
  const { successNotification, errorNotification } = useCustomAlerts()
  const { colorSuccess } = theme.useToken().token

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm<{ newValue: number }>()

  async function handleApprove() {
    setIsLoading(true)
    const resp = await moderatePost({ postId: post.id, moderation: 'approve' })

    if (resp.ok) {
      navigate('/posts', { replace: true })
      successNotification(
        'Publicación aprobada',
        'La publicación fue aprobada con éxito y ya está visible para intercambiar'
      )
    } else {
      errorNotification('Ocurrió un error', resp.messages.join('\n'))
    }

    setIsLoading(false)
  }

  async function handleEditValueAndApprove() {
    const resp = await moderatePost({
      postId: post.id,
      moderation: 'approve',
      newValue: form.getFieldValue('newValue'),
    })

    if (resp.ok) {
      navigate('/posts', { replace: true })
      successNotification(
        'Publicación aprobada',
        'La publicación fue aprobada con éxito y ya está visible para intercambiar'
      )
    } else {
      errorNotification('Ocurrió un error', resp.messages.join('\n'))
    }
  }

  useEffect(() => {
    form.setFieldValue('newValue', post.value)
  }, [form, post.value])

  return (
    <>
      <ConfigProvider theme={{ token: { colorPrimary: colorSuccess } }}>
        <Dropdown.Button
          type="primary"
          icon={<DownOutlined />}
          disabled={isLoading}
          menu={{
            items: [
              {
                key: '1',
                icon: <EditOutlined />,
                label: 'Editar valor y aprobar',
                onClick: () => setIsModalOpen(true),
              },
            ],
          }}
          placement="bottom"
          onClick={handleApprove}
        >
          <CheckOutlined /> Aprobar
        </Dropdown.Button>
      </ConfigProvider>
      <Modal
        title="Editar valor y aprobar"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isLoading}
        okText="Editar y aprobar"
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: colorSuccess } }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleEditValueAndApprove}
        >
          <Form.Item
            label="Nuevo valor"
            name="newValue"
            required={false}
            rules={[{ required: true, message: 'Ingrese un valor' }]}
          >
            <Select
              options={[
                { value: 1 },
                { value: 2 },
                { value: 3 },
                { value: 4 },
                { value: 5 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

function RejectButton({
  post,
  isLoading,
  setIsLoading,
}: ModerationButtonProps) {
  const navigate = useNavigate()
  const { successNotification, errorNotification } = useCustomAlerts()

  async function handleReject() {
    setIsLoading(true)
    const resp = await moderatePost({ postId: post.id, moderation: 'reject' })

    if (resp.ok) {
      navigate('/posts', { replace: true })
      successNotification('Publicación rechazada', resp.messages.join('\n'))
    } else {
      errorNotification('Ocurrió un error', resp.messages.join('\n'))
    }

    setIsLoading(false)
  }

  return (
    <Button
      type="primary"
      danger
      block
      icon={<CloseOutlined />}
      disabled={isLoading}
      onClick={handleReject}
    >
      Rechazar
    </Button>
  )
}

function BlockUserButton({
  post,
  isLoading,
  setIsLoading,
}: ModerationButtonProps) {
  const { colorError } = theme.useToken().token
  const navigate = useNavigate()
  const { successNotification, errorNotification } = useCustomAlerts()

  async function handleDelete() {
    setIsLoading(true)
    const data = await putUserInReview(post.user.id)
    setIsLoading(false)

    if (data.ok) {
      navigate('/posts', { replace: true })
      successNotification(
        'Usuario bloqueado',
        `El usuario ${post.user.first_name} ${post.user.last_name} fue bloqueado correctamente`
      )
    } else {
      errorNotification('Ocurrió un error', data.messages.join('\n'))
    }
  }

  return (
    <Popconfirm
      title="Bloquear usuario"
      description="¿Seguro que desea bloquear al usuario?"
      okText="Sí, bloquear usuario"
      cancelText="No, cancelar"
      okType="danger"
      placement="bottom"
      icon={<ExclamationCircleOutlined style={{ color: colorError }} />}
      onConfirm={handleDelete}
      cancelButtonProps={{ disabled: isLoading }}
    >
      <Button danger block icon={<UserDeleteOutlined />} disabled={isLoading}>
        Bloquear usuario
      </Button>
    </Popconfirm>
  )
}
