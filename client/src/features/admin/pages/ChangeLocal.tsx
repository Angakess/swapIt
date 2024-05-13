import { Card, Col, Modal, Row, Spin } from "antd"
import { useEffect, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

type HelperType = {
    id: number,
    name: string,
    subsidiary: {
        id: number,
        name: string,
        x_coordinate: string,
        y_coordinate: string,
        max_helpers: number,
        active: boolean
    }
}
type SubsidiaryType = {
    id: number,
    name: string,
    x_coordinate: string,
    y_coordinate: string,
    max_helpers: number,
    active: boolean
}
export function ChangeLocal() {

    const MOCK_HELPER: HelperType = {
        id: 7,
        name: "Pedro",
        subsidiary: {
            id: 7,
            name: "La Plata",
            x_coordinate: "-34.9205",
            y_coordinate: "-57.9536",
            max_helpers: 5,
            active: true
        }
    }

  const parts = window.location.href.split('/')
  const helperId: number = parseInt(parts[parts.length - 1])

  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [subsData, setSubsData] = useState<SubsidiaryType[]>([{
    id: 0,
    name: "",
    x_coordinate: "0",
    y_coordinate: "0",
    max_helpers: 0,
    active: false
  }])
  const [helperData, setHelperData] = useState<HelperType>(MOCK_HELPER)

  const [idSelected, setIdSelected] = useState<number>(0)

    const fetchSubsData = async() => {
        setIsLoading(true)
        const res = await fetch("http://localhost:8000/subsidiary/subsidiaries/")
        const result = await res.json()
        setSubsData(result)
        setIsLoading(false)
    }
    useEffect(() => {
        fetchSubsData()
    },[])

    const fetchHelperData = async() => {
        setIsLoading(true)
        
    }

    const handleMarkerClick = (index:number) => {
        console.log("Clickeaste la filial de ",subsData[index].name)
        setModalOpen(true)
        setIdSelected(index)
    }
    const handleOk = () => {

    }
    const handleCancel = () => {
        setModalOpen(false)
    }
    
  return (
    <Spin spinning={isLoading}>
      <Row>
        <Col span={24}>
            <Card title="Mapa"
                style={{width: "100%",
                    height:"500px"
                }}>
                <MapContainer
                center={[parseFloat(helperData.subsidiary.x_coordinate), parseFloat(helperData.subsidiary.y_coordinate)]}
                zoom={12}
                zoomControl={false}
                style={{ borderRadius: "5px", height: '400px' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {subsData.map((marcador, index) => (
                        <Marker 
                            key={index} 
                            position={[parseFloat(marcador.x_coordinate), parseFloat(marcador.y_coordinate)]}
                            eventHandlers={{
                                click: () => (handleMarkerClick(index))
                            }}
                            
                            >
                            <Popup>{marcador.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Card>

        </Col>
      </Row>
      <Modal
        title="Cambio de filial"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Confirmar"
      >
        <p>¿Está seguro que quiere cambiar la filial de {helperData.name}? </p>
        <p>{"("}De {helperData.subsidiary.name} a {subsData[idSelected].name}{")"}</p>
        {/* {data[idSelected] && data[idSelected].subsidiary_cant_helpers === 1 ? 
        <p style={{fontWeight: "bold"}}>IMPORTANTE: Si {data[idSelected].full_name} es desincorporada la filial {data[idSelected].subsidiary_name} se quedará sin ayudantes, lo que deshabilitará la sucursal y suspenderá todas las publicaciones relacionadas</p> : null} */}
      </Modal>
      {/* <Modal
        title="Cambio de filial"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Confirmar"
      >
        <p>¿Está seguro que quiere cambiar la filial de {helperData.name}?</p>
      </Modal> */}

    </Spin>
  )
}
