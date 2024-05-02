// import {
//   EditOutlined,
//   EllipsisOutlined,
//   SettingOutlined,
// } from '@ant-design/icons'
import { Card, Carousel, Typography, theme } from 'antd'

const images = [
  'https://picsum.photos/200/300',
  'https://picsum.photos/300/600',
  'https://picsum.photos/100/150',
  'https://picsum.photos/300',
]

export function PostItem() {
  return (
    <Card
      style={{ overflow: 'hidden' }}
      hoverable
      cover={<PostItemCarousel images={images} />}
      // actions={[
      //   <SettingOutlined key="setting" />,
      //   <EditOutlined key="edit" />,
      //   <EllipsisOutlined key="ellipsis" />,
      // ]}
    >
      <Card.Meta
        title="Título de la publicación"
        description={
          <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
            modi tempora veniam ducimus earum veritatis. Dicta, doloribus odio
            libero molestias maxime, commodi assumenda vel hic aliquid voluptate
            ducimus aperiam voluptatibus!
          </Typography.Paragraph>
        }
      />
    </Card>
  )
}

const mainImageStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: '1',
  height: '300px',
  width: '100%',
  objectFit: 'contain',
}

const backgroundImageStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: '0',
  height: '300px',
  width: '100%',
  objectFit: 'cover',
  objectPosition: 'center center',
  filter: 'blur(5px) brightness(0.4)',
}

function PostItemCarousel({ images }: { images: string[] }) {
  const { colorPrimary } = theme.useToken().token

  const containerStyle: React.CSSProperties = {
    height: '300px',
    width: '100%',
    position: 'relative',
    backgroundColor: colorPrimary,
  }

  return (
    <Carousel>
      {images.map((img, i) => (
        <div>
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
