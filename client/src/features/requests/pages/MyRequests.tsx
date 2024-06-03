import { PageTitle } from '@Common/components'
import { TableMyOffers, TableMyPetitions } from '@Requests/components'
import { Typography } from 'antd'

export function MyRequests() {
  return (
    <>
      <PageTitle title="Mis solicitudes"></PageTitle>
      <Typography.Title level={3}>Ofertas</Typography.Title>
      <TableMyOffers></TableMyOffers>
      <Typography.Title level={3}>Pedidos</Typography.Title>
      <TableMyPetitions></TableMyPetitions>
    </>
  )
}
