// import {
//   EditOutlined,
//   EllipsisOutlined,
//   SettingOutlined,
// } from '@ant-design/icons'
import { Card, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { ImageCarousel } from './ImageCarousel'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'

const IMG_HEIGHT = '300px'

export function PostListItem({ post }: { post: PostModel }) {
  const images = Object.entries(post)
    .filter(([key, value]) => key.startsWith('image_') && value != null)
    .map(([, value]) => value) as string[]

  return (
    <Link to={`/posts/${post.id}`}>
      <Card
        style={{ overflow: 'hidden', height: '100%' }}
        styles={{ body: { height: `calc(100% - ${IMG_HEIGHT})` } }}
        hoverable
        cover={<ImageCarousel imagesUrls={images} imageHeight={IMG_HEIGHT} />}
        // actions={[
        //   <SettingOutlined key="setting" />,
        //   <EditOutlined key="edit" />,
        //   <EllipsisOutlined key="ellipsis" />,
        // ]}
        bordered
      >
        <Flex vertical justify="space-between" style={{ height: '100%' }}>
          <Card.Meta
            title={post.name}
            description={
              <Typography.Paragraph
                type="secondary"
                ellipsis={{ rows: 2 }}
                style={{ whiteSpace: 'pre-line' }}
                title={post.description}
              >
                {post.description}
              </Typography.Paragraph>
            }
            style={{ marginBottom: '0.5rem' }}
          />
          <div>
            <Tag
              bordered={false}
              color="blue"
              style={{ textTransform: 'capitalize' }}
            >
              {post.category.name}
            </Tag>
            <Tag
              bordered={false}
              color="default"
              style={{
                backgroundColor: 'transparent',
                textTransform: 'capitalize',
              }}
            >
              {post.state_product}
            </Tag>
          </div>
        </Flex>
      </Card>
    </Link>
  )
}
