import { Card, Col, Row, Space, Typography } from "antd"
import { useEffect, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"

type HelperType = {

}
type SubsidairyType = {
    id: number,
    name: string,
    x_coordinate: string,
    y_coordinate: string,
    max_helpers: number,
    active: boolean
}
export function ChangeLocal() {
  const parts = window.location.href.split('/')
  const helperId: number = parseInt(parts[parts.length - 1])

  const [isLoading, setIsLoading] = useState(false)
  const [subsData, setSubsData] = useState<SubsidairyType[]>([{
    id: 0,
    name: "",
    x_coordinate: "123.456",
    y_coordinate: "789.012",
    max_helpers: 0,
    active: false
  }])
  const [helperData, setHelperData] = useState<HelperType>()

    const fetchSubsData = async() => {
        setIsLoading(true)
        const res = await fetch("http://localhost:8000/subsidiary/subsidiaries/")
        const result = await res.json()
        setSubsData(result)
        setIsLoading(false)
    }
    useEffect(() => {fetchSubsData},[])
    
  return (
    <>
      <Row>
        <Col span={24}>
            <Card title="Mapa"
                style={{width: "100%",
                    height:"500px"
                }}>
                <MapContainer
                center={[-34.9222141, -57.955808]}
                zoom={15}
                zoomControl={false}
                style={{ borderRadius: "5px", height: '400px' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {subsData.map((marcador, index) => (
                        <Marker key={index} position={[parseFloat(marcador.x_coordinate), parseFloat(marcador.y_coordinate)]}>
                            <Popup>{marcador.name}</Popup>
                        </Marker>
      ))}
    </MapContainer>
            </Card>

        </Col>
      </Row>
    </>
  )
}
