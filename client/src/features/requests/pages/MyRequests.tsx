import { PageTitle } from "@Common/components";
import { TableMyOffers, TableMyPetitions } from "@Requests/components";

export function MyRequests() {
   
    return (
        <>
            <PageTitle title="Mis solicitudes"></PageTitle>
            <h2>Ofertas</h2>
            <TableMyOffers></TableMyOffers>
            <h2>Pedidos</h2>
            <TableMyPetitions></TableMyPetitions>
        </>
    )
}