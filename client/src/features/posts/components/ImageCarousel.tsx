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
  disableCarousel?: boolean
}

export function ImageCarousel({
  carouselProps = {},
  imagesUrls,
  imageHeight,
  styles = { background: {}, container: {}, main: {} },
  disableCarousel = false,
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

  if (disableCarousel) {
    return (
      <div style={{ ...containerStyle, ...styles.container }}>
        <img
          style={{ ...mainImageStyle, ...styles.main }}
          src={imagesUrls[0]}
          alt={`image ${1}`}
        />
        <img
          style={{ ...backgroundImageStyle, ...styles.background }}
          src={imagesUrls[0]}
          alt={`background image ${1}`}
        />
      </div>
    )
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
