import { SwapOutlined } from '@ant-design/icons'
import { Button, Empty, Flex, List, Modal, Typography } from 'antd'
import { PostModel, getPostList } from '@Common/api'
import { useEffect, useState } from 'react'
import { useAuth } from '@Common/hooks'

type ExchangePostModalProps = {
  post: PostModel
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ExchangePostModal({
  post,
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
        category: post.category.name,
      })
      setMyPosts(p)
      setIsLoading(false)
    })()
  }, [post.category.name, user])

  return (
    <Modal
      title="Intercambiar producto"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <ExchangePostsList isLoading={isLoading} posts={myPosts} post={post} />
    </Modal>
  )
}

type ExchangePostsListProps = {
  isLoading: boolean
  posts: PostModel[]
  post: PostModel
}

function ExchangePostsList({ isLoading, posts, post }: ExchangePostsListProps) {
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

            <Button type="primary" icon={<SwapOutlined />}>
              Solicitar
            </Button>
          </Flex>
        </List.Item>
      )}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={`No tienes productos disponibles para intercambiar que pertenezcan a la categoría ${post.category.name}.`}
            style={{ textWrap: 'balance' }}
          />
        ),
      }}
    />
  )
}
