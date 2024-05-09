// import {
//   EditOutlined,
//   EllipsisOutlined,
//   SettingOutlined,
// } from '@ant-design/icons'
import { Card, Carousel, Flex, Tag, Typography, theme } from 'antd'
import { Link } from 'react-router-dom'

const IMG_HEIGHT = '300px'

export function PostItem({ post }: { post: Post }) {
  return (
    <Link to={`/posts/${post.id}`}>
      <Card
        style={{ overflow: 'hidden', height: '100%' }}
        styles={{ body: { height: `calc(100% - ${IMG_HEIGHT})` } }}
        hoverable
        cover={<PostItemCarousel images={post.images} />}
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

const mainImageStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: '1',
  height: IMG_HEIGHT,
  width: '100%',
  objectFit: 'contain',
}

const backgroundImageStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: '0',
  height: IMG_HEIGHT,
  width: '100%',
  objectFit: 'cover',
  objectPosition: 'center center',
  filter: 'blur(5px) brightness(0.4)',
}

function PostItemCarousel({ images }: { images: string[] }) {
  const { colorPrimary } = theme.useToken().token

  const containerStyle: React.CSSProperties = {
    height: IMG_HEIGHT,
    width: '100%',
    position: 'relative',
    backgroundColor: colorPrimary,
  }

  return (
    <Carousel>
      {images.map((img, i) => (
        <div key={i}>
          <div style={containerStyle}>
            <img style={mainImageStyle} src={img} alt={`image ${i}`} />
            <img
              key={img}
              style={backgroundImageStyle}
              src={img}
              alt={`background image ${i}`}
            />
          </div>
        </div>
      ))}
    </Carousel>
  )
}
