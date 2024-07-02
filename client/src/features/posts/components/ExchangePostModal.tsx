import { SwapOutlined } from '@ant-design/icons'
import { Button, Empty, Flex, List, Modal, Typography } from 'antd'
import { PostModel, createRequest, getPostList } from '@Common/api'
import { useEffect, useState } from 'react'
import { useAuth, useCustomAlerts } from '@Common/hooks'

type ExchangePostModalProps = {
  postReceiver: PostModel
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ExchangePostModal({
  postReceiver,
  isOpen,
  setIsOpen,
}: ExchangePostModalProps) {
  const { user } = useAuth()

  const [myPosts, setMyPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const p = await getPostList({
        userId: user!.id,
        status: 'activo',
        category: postReceiver.category.name,
      })
      setMyPosts(p)
      setIsLoading(false)
    })()
  }, [postReceiver.category.name, user])

  return (
    <Modal
      title="Intercambiar producto"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <ExchangePostsList
        isLoading={isLoading}
        posts={myPosts}
        postReceiver={postReceiver}
      />
    </Modal>
  )
}

type ExchangePostsListProps = {
  isLoading: boolean
  posts: PostModel[]
  postReceiver: PostModel
}

function ExchangePostsList({
  isLoading,
  posts,
  postReceiver,
}: ExchangePostsListProps) {
  const { successNotification, errorNotification } = useCustomAlerts()

  async function handleRequest(postMaker: PostModel) {
    console.log('maker', postMaker)
    console.log('receive', postReceiver)

    const resp = await createRequest({
      user_maker: postMaker.user.id,
      post_maker: postMaker.id,
      user_receive: postReceiver.user.id,
      post_receive: postReceiver.id,
    })

    if (resp.ok) {
      successNotification(
        'Solicitud creada con éxito',
        'Se ha enviado una solicitud de intercambio.'
      )
    } else {
      errorNotification(
        'Ocurrió un error al enviar la solicitud',
        resp.messages.join('\n')
      )
    }
  }

  return (
    <List
      size="large"
      loading={isLoading}
      dataSource={posts}
      renderItem={(post) => (
        <List.Item>
          <Flex
            align="center"
            justify="space-between"
            style={{ width: '100%' }}
          >
            <Flex align="center" gap={'0.5rem'}>
              <img
                src={post.image_1}
                alt={post.name}
                style={{
                  height: '3.25rem',
                  width: '3.25rem',
                  objectFit: 'contain',
                }}
              />
              <Typography.Text strong style={{ textWrap: 'balance' }}>
                {post.name}
              </Typography.Text>
            </Flex>

            <Button
              type="primary"
              icon={<SwapOutlined />}
              onClick={() => handleRequest(post)}
            >
              Solicitar
            </Button>
          </Flex>
        </List.Item>
      )}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              'No tienes productos disponibles para intercambiar que pertenezcan a la categoría.'
            }
            style={{ textWrap: 'balance' }}
          />
        ),
      }}
    />
  )
}
