// import {
//   EditOutlined,
//   EllipsisOutlined,
//   SettingOutlined,
// } from '@ant-design/icons'
import { Card, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'

import { PostModel } from '@Common/api'
import { getPostImagesArray } from '@Posts/helpers'
import { ImageCarousel } from './ImageCarousel'

const IMG_HEIGHT = '300px'

export function PostListItem({
  post,
  showStatus = false,
}: {
  post: PostModel
  showStatus?: boolean
}) {
  return (
    <Link to={`/posts/${post.id}`}>
      <Card
        style={{ overflow: 'hidden', height: '100%', position: 'relative' }}
        styles={{ body: { height: `calc(100% - ${IMG_HEIGHT})` } }}
        hoverable
        cover={
          <ImageCarousel
            imagesUrls={getPostImagesArray(post)}
            imageHeight={IMG_HEIGHT}
          />
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
          {showStatus && (
            <Tag
              bordered={false}
              color="default"
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0rem',
                textTransform: 'capitalize',
              }}
            >
              {post.state.name}
            </Tag>
          )}
        </Flex>
      </Card>
    </Link>
  )
}
