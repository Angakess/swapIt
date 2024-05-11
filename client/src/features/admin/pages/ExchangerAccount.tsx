import { Card, Descriptions, DescriptionsProps, Space } from "antd";
import { useState } from "react";


type DataType = {
    first_name: string,
    last_name: string,
    dni: number,
    email: string,
    gender: string,
    date_of_birth: string,
    phone_number: string,
    status: string
}

export function ExchangerAccount(){
    
    const [data, setData] = useState<DataType>({
        first_name: "",
        last_name: "",
        dni: 0,
        email: "",
        gender: "",
        date_of_birth: "",
        phone_number: "",
        status: ""
    })
    const fetchData = () => {
        
    }

    const items: DescriptionsProps['items'] = [
        {
            key: "1",
            label: "Nombre",
            children: `${data.first_name} ${data.last_name}`
        },
        {
            key: "2",
            label: "DNI",
            children: `${data.dni}`
        },
        {
            key: "3",
            label: "Email",
            children: `${data.email}`
        },
        {
            key: "4",
            label: "Teléfono",
            children: `${data.phone_number}`
        },
        {
            key: "5",
            label: "Fecha de nacimiento",
            children: `${data.date_of_birth}`
        },
        {
            key: "6",
            label: "Género",
            children: `${data.gender}`
        },
        {
            key: "7",
            label: "Estado",
            children: `${data.status}`
        },
    ]

    return (
        
        <>
            <Descriptions 
                title="Información de usuario"
                items={items}
            />
            <Card
                title = "Perfil de usuario"
            >
                <Descriptions 
                    bordered
                    layout="horizontal"
                    column={1}
                    items={items}
                    labelStyle={{width: "15%"}}
            />
            </Card>
        </>
        
    )
}