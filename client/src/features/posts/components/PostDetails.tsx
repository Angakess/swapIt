import { useAuth } from '@Common/hooks'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'
import { Typography } from 'antd'

export function PostDetails({ post }: { post: PostModel }) {
  const { user } = useAuth()

  return (
    <>
      <Typography.Title level={4}>Detalles</Typography.Title>

      <Typography.Paragraph style={{ whiteSpace: 'pre-line' }}>
        {post.description}
      </Typography.Paragraph>

      <DetailItem name="Estado" value={post.state_product} />
      <DetailItem name="Categoría" value={post.category.name} />
      <DetailItem name="Valor" value={post.value.toString()} />
      <DetailItem name="Cantidad" value={post.stock_product.toString()} />
      {user!.id === post.user.id && (
        <DetailItem name="Estado publicación" value={post.state.name} />
      )}
    </>
  )
}

function DetailItem({ name, value }: { name: string; value: string }) {
  return (
    <div>
      <Typography.Text
        strong
        style={{
          minWidth: '4.75rem',
          display: 'inline-block',
          lineHeight: 2,
        }}
      >
        {name}:
      </Typography.Text>{' '}
      <Typography.Text style={{ textTransform: 'capitalize' }}>
        {value.toLowerCase()}
      </Typography.Text>
    </div>
  )
}
