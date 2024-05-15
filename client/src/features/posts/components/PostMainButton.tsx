import { Button, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import { useAuth } from '@Common/hooks'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'

export function PostMainButton({ post }: { post: PostModel }) {
  const { user } = useAuth()

  if (user!.role === 'EXCHANGER') {
    if (user!.id === post.user.id) {
      return (
        <Button
          type="primary"
          block
          size="large"
          style={{ fontWeight: '700', marginBottom: '1.5rem' }}
        >
          Editar
        </Button>
      )
    }

    return (
      <Button
        type="primary"
        block
        size="large"
        style={{ fontWeight: '700', marginBottom: '1.5rem' }}
      >
        Intercambiar
      </Button>
    )
  }

  if (post.state.name === 'activo') {
    return (
      <Button
        type="primary"
        block
        size="large"
        style={{ fontWeight: '700', marginBottom: '1.5rem' }}
        disabled
      >
        Publicación activa
      </Button>
    )
  }

  return (
    <>
      <Dropdown menu={{}}>
        <Button>
          <Space>
            Button
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <Dropdown.Button menu={{}} danger>
        Danger
      </Dropdown.Button>
    </>
  )
}
