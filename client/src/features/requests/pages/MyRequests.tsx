import { useAuth } from "@Common/hooks"
import { useEffect, useState } from "react"

const getRequests = async (id:number) => {
    return fetch('http://localhost:8000/requests/my_requests/?user_receive__id=' +id)
        .then(response => response.json())
        .then(data => {
            console.log("[DATA REQUESTS]", data)
            return data
        })
        .catch(error => console.log("[ERROR REQUESTS]", error))

}

export function MyRequests() {
    const [request, setRequest] = useState<any | null>(null)

    const { user } = useAuth()
    useEffect(() => {
        if (!request)
            (
                async () => {
                    const data = await getRequests(user!.id)
                    setRequest(data)
                }

            )()

    }, [])

    console.log("[REQUEST]", request)
    return (
        <p>{JSON.stringify(request, null, 4)}</p>
    )
}