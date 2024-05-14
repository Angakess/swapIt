// import {
//   EditOutlined,
//   EllipsisOutlined,
//   SettingOutlined,
// } from '@ant-design/icons'
import { Card, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { ImageCarousel } from './ImageCarousel'
import { PostModel } from '@Posts/helpers/getPostsListsExchanger'
import { SERVER_URL } from 'constants'

const IMG_HEIGHT = '300px'

export function PostItem({ post }: { post: PostModel }) {
  const images = Object.entries(post)
    .filter(([key, value]) => key.startsWith('image_') && value != null)
    .map(([, value]) => SERVER_URL + value) as string[]

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
