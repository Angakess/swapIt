import { Carousel, CarouselProps, theme } from 'antd'

type ImageCarouselProps = {
  carouselProps?: CarouselProps
  imagesUrls: string[]
  imageHeight: React.CSSProperties['height']
  styles?: {
    container?: React.CSSProperties
    main?: React.CSSProperties
    background?: React.CSSProperties
  }
}

export function ImageCarousel({
  carouselProps = {},
  imagesUrls,
  imageHeight,
  styles = { background: {}, container: {}, main: {} },
}: ImageCarouselProps) {
  const { colorPrimary: color } = theme.useToken().token

  const containerStyle: React.CSSProperties = {
    height: imageHeight,
    width: '100%',
    position: 'relative',
    backgroundColor: color,
  }

  const mainImageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: '1',
    height: imageHeight,
    width: '100%',
    objectFit: 'contain',
  }

  const backgroundImageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: '0',
    height: imageHeight,
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
    filter: 'blur(5px) brightness(0.4)',
    backgroundColor: color,
  }

  return (
    <Carousel {...carouselProps}>
      {imagesUrls.map((url, i) => (
        <div key={i}>
          <div style={{ ...containerStyle, ...styles.container }}>
            <img
              style={{ ...mainImageStyle, ...styles.main }}
              src={url}
              alt={`image ${i}`}
            />
            <img
              style={{ ...backgroundImageStyle, ...styles.background }}
              src={url}
              alt={`background image ${i}`}
            />
          </div>
        </div>
      ))}
    </Carousel>
  )
}
