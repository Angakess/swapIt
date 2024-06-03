import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { PageTitle } from '@Common/components'
import { TableMyOffers, TableMyPetitions } from '@Requests/components'
import { Typography } from 'antd'

export function MyRequests() {
  return (
    <>
      <PageTitle title="Mis solicitudes"></PageTitle>
      <Typography.Title level={3}>
        Ofertas <ArrowRightOutlined style={{ fontSize: '0.75em' }} />
      </Typography.Title>
      <TableMyOffers></TableMyOffers>
      <Typography.Title level={3}>
        Pedidos <ArrowLeftOutlined style={{ fontSize: '0.75em' }} />
      </Typography.Title>
      <TableMyPetitions></TableMyPetitions>
    </>
  )
}
