import { PageTitle } from "@Common/components";
import { TableMyOffers, TableMyPetitions } from "@Requests/components";

export function MyRequests() {
   
    return (
        <>
            <PageTitle title="Mis solicitudes"></PageTitle>
            <h1>Ofertas</h1>
            <TableMyOffers></TableMyOffers>
            <h1>Pedidos</h1>
            <TableMyPetitions></TableMyPetitions>
        </>
    )
}