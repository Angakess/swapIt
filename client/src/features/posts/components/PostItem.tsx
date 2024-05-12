// import {
//   EditOutlined,
//   EllipsisOutlined,
//   SettingOutlined,
// } from '@ant-design/icons'
import { Card, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { ImageCarousel } from './ImageCarousel'
import { Post } from 'types'

const IMG_HEIGHT = '300px'

export function PostItem({ post }: { post: Post }) {
  return (
    <Link to={`/posts/${post.id}`}>
      <Card
        style={{ overflow: 'hidden', height: '100%' }}
        styles={{ body: { height: `calc(100% - ${IMG_HEIGHT})` } }}
        hoverable
        cover={
          <ImageCarousel imagesUrls={post.images} imageHeight={IMG_HEIGHT} />
        }
        // actions={[
        //   <SettingOutlined key="setting" />,
        //   <EditOutlined key="edit" />,
        //   <EllipsisOutlined key="ellipsis" />,
        // ]}
        bordered
      >
        <Flex vertical justify="space-between" style={{ height: '100%' }}>
          <Card.Meta
            title={post.title}
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
            <Tag bordered={false} color="blue">
              {post.category}
            </Tag>
            <Tag
              bordered={false}
              color="default"
              style={{ backgroundColor: 'transparent' }}
            >
              {post.state}
            </Tag>
          </div>
        </Flex>
      </Card>
    </Link>
  )
}
