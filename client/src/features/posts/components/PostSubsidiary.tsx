import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Card, Typography, theme } from 'antd'

import { PostModel } from '@Common/api'

export function PostSubsidiary({ post }: { post: PostModel }) {
  const { borderRadiusLG } = theme.useToken().token

  const [address, setAddress] = useState<string>('Cargando...')

  useEffect(() => {
    ;(async () => {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${post.subsidiary.x_coordinate}&lon=${post.subsidiary.y_coordinate}`
      )
      const data = await resp.json()

      if (resp.ok && data.address) {
        const { city, house_number, road, state, town } = data.address
        setAddress(`${road} #${house_number}, ${town || city}, ${state}.`)
      }
    })()
  }, [post.subsidiary.x_coordinate, post.subsidiary.y_coordinate])

  return (
    <Card>
      <Typography.Title level={4}>Filial</Typography.Title>
      <MapContainer
        center={[
          Number(post!.subsidiary.x_coordinate),
          Number(post!.subsidiary.y_coordinate),
        ]}
        zoom={15}
        zoomControl={false}
        style={{ borderRadius: borderRadiusLG, height: '160px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[
            Number(post!.subsidiary.x_coordinate),
            Number(post!.subsidiary.y_coordinate),
          ]}
        />
      </MapContainer>
      <Typography.Text strong style={{ marginTop: '1rem', display: 'block' }}>
        {post!.subsidiary.name}
      </Typography.Text>
      {address !== '' && (
        <Typography.Text type="secondary">{address}</Typography.Text>
      )}
    </Card>
  )
}
