import { App, Button, Col, Popconfirm, Row, theme } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { PostModel } from '@Common/api'
import { SERVER_URL } from 'constants'
import { useState } from 'react'
import { PostUpdateModal } from '../PostCreateUpdate'
import { useCustomAlerts } from '@Common/hooks'

type OwnerButtonsProps = {
  post: PostModel
  setPost: React.Dispatch<React.SetStateAction<PostModel | null>>
  isEditable: boolean
}

export function OwnerButtons({ post, setPost, isEditable }: OwnerButtonsProps) {
  const { notification } = App.useApp()
  const { errorNotification } = useCustomAlerts()
  const navigate = useNavigate()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function deletePost() {
    setIsLoading(true)

    const resp = await fetch(`${SERVER_URL}/post/remove/${post.id}`, {
      method: 'DELETE',
    })
    const data = await resp.json()
    setIsLoading(false)

    if (resp.ok && data.ok) {
      notification.success({
        message: 'Publicación eliminada correctamente',
        description: 'La publicación ya no estará disponible',
        placement: 'topRight',
        duration: 3,
      })
      navigate('/posts/my-posts', { replace: true })
    } else {
      notification.error({
        message: 'Ocurrió un error al eliminar la publicación',
        description: data.messages.join('\n'),
        placement: 'topRight',
        duration: 3,
        style: { whiteSpace: 'pre-line' },
      })
    }
  }

  function handleEditClick() {
    if (!isEditable) {
      errorNotification(
        'No puedes borrar la publicación',
        'No puedes borrar la publicación porque tiene solicitudes o turnos pendientes'
      )
      return
    }

    setIsEditModalOpen(true)
  }

  return (
    <>
      <Row gutter={[12, 12]} style={{ marginBottom: '1.5rem' }}>
        <Col xs={24} sm={16}>
          <Button
            type="primary"
            block
            size="large"
            style={{ fontWeight: '700' }}
            onClick={handleEditClick}
            disabled={isLoading}
          >
            Editar
          </Button>
        </Col>
        <Col xs={24} sm={8}>
          <DeleteButton
            deletePost={deletePost}
            isEditable={isEditable}
            isLoading={isLoading}
          />
        </Col>
      </Row>
      <PostUpdateModal
        post={post}
        setPost={setPost}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </>
  )
}

type DeleteButtonProps = {
  deletePost: () => Promise<void>
  isLoading: boolean
  isEditable: boolean
}

function DeleteButton({
  deletePost,
  isLoading,
  isEditable,
}: DeleteButtonProps) {
  const { colorError } = theme.useToken().token
  const { errorNotification } = useCustomAlerts()

  if (!isEditable) {
    return (
      <Button
        type="primary"
        danger
        block
        size="large"
        disabled={isLoading}
        onClick={() =>
          errorNotification(
            'No puedes borrar la publicación',
            'No puedes borrar la publicación porque tiene solicitudes o turnos pendientes'
          )
        }
      >
        Eliminar
      </Button>
    )
  }

  return (
    <Popconfirm
      title="Eliminar publicación"
      description="¿Esta seguro que desea eliminar la publicación?"
      okText="Sí, eliminar publicación"
      cancelText="No, cancelar"
      okType="danger"
      placement="bottomLeft"
      icon={<ExclamationCircleOutlined style={{ color: colorError }} />}
      onConfirm={deletePost}
    >
      <Button type="primary" danger block size="large" disabled={isLoading}>
        Eliminar
      </Button>
    </Popconfirm>
  )
}
