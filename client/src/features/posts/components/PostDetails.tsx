import { PostModel } from '@Posts/helpers/getPostsListsExchanger'
import { Typography } from 'antd'

export function PostDetails({ post }: { post: PostModel }) {
  return (
    <>
      <Typography.Title level={4}>Detalles</Typography.Title>

      <Typography.Paragraph style={{ whiteSpace: 'pre-line' }}>
        {post.description}
      </Typography.Paragraph>

      <DetailItem name="Estado" value={post.state_product} />
      <DetailItem name="Categoría" value={post.category.name} />
      <DetailItem name="Valor" value={post.value.toString()} />
    </>
  )
}

function DetailItem({ name, value }: { name: string; value: string }) {
  return (
    <div>
      <Typography.Text
        strong
        style={{
          minWidth: '4.5rem',
          display: 'inline-block',
          lineHeight: 1.75,
        }}
      >
        {name}:
      </Typography.Text>
      <Typography.Text style={{ textTransform: 'capitalize' }}>
        {value.toLowerCase()}
      </Typography.Text>
    </div>
  )
}
