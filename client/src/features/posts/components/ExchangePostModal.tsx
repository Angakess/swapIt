import { SwapOutlined } from '@ant-design/icons'
import { Button, Flex, List, Modal, Typography } from 'antd'
import { PostModel, getPostList } from '@Common/api'
import { useEffect, useState } from 'react'
import { useAuth } from '@Common/hooks'

type ExchangePostModalProps = {
  post: PostModel
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ExchangePostModal({
  isOpen,
  setIsOpen,
}: ExchangePostModalProps) {
  const { user } = useAuth()

  const [myPosts, setMyPosts] = useState<PostModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const p = await getPostList({ userId: user!.id, status: 'activo' })
      setMyPosts(p)
      setIsLoading(false)
    })()
  }, [])

  return (
    <Modal
      title="Intercambiar producto"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <ExchangePostsList isLoading={isLoading} posts={myPosts} />
    </Modal>
  )
}

type ExchangePostsListProps = {
  isLoading: boolean
  posts: PostModel[]
}

function ExchangePostsList({ isLoading, posts }: ExchangePostsListProps) {
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
    />
  )
}
