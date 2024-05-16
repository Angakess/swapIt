import { Card, Col, Modal, Row, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import redMarkerIcon from '/map-pin-red.svg'
import grayMarkerIcon from '/map-pin-gray.svg'
import { Icon } from 'leaflet'
import { fetchPost } from '@Common/helpers'

type HelperType = {
  id: number
  full_name: string
  subsidiary: {
    id: number
    name: string
    x_coordinate: string
    y_coordinate: string
    max_helpers: number
    cant_current_helpers: number
    active: boolean
  }
}
type SubsidiaryType = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  cant_current_helpers: number
  active: boolean
}
type PropType = {
  helper: HelperType
}
export function ChangeLocal() {

  const parts = window.location.href.split('/')
  const helperId: number = parseInt(parts[parts.length - 1])

  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [subsData, setSubsData] = useState<SubsidiaryType[]>()
  const [helperData, setHelperData] = useState<HelperType>()

  const [subSelected, setSubSelected] = useState<SubsidiaryType>()

  const fetchSubsData = async () => {
    setIsLoading(true)
    const res = await fetch('http://localhost:8000/subsidiary/subsidiaries/')
    const result = await res.json()
    setSubsData(result)
    setIsLoading(false)
  }
  useEffect(() => {fetchSubsData()}, [])

  const fetchHelperData = async () => {
    setIsLoading(true)
    try{
      const res = await fetch(`http://localhost:8000/users/get-helper/${helperId}`)
      const result = await res.json()
      setHelperData(result)
    }
    catch(error){
      Modal.error({
        title: "Error",
        content: "No se encontró al ayudante pedido"
      })
    }
    setIsLoading(false)
  }
  useEffect(() => {fetchHelperData()},[])

  const handleMarkerClick = (marcador: SubsidiaryType, helper: HelperType) => {
    if (helper.subsidiary.id === marcador.id) {
      openErrorModal('No puede seleccionar la filial actual')
      return
    }
    if (marcador.cant_current_helpers === marcador.max_helpers) {
      openErrorModal('La filial seleccionada no posee cupo disponible')
      return
    }
    setModalOpen(true)
    setSubSelected(marcador)
  }
  const handleOk = async() => {
    setIsLoading(true)
    const res = await fetchPost(`http://localhost:8000/users/change-filial/${helperId}/${subSelected?.id}`,{})
    const result = await res.json()
    if(res.ok){
      Modal.success({
        title:"Operación completada",
        content: result.messages
      })
    }
    else{
      Modal.error({
        title:"Operación fallida",
        content: result.messages
      })
    }
    setModalOpen(false)
    setIsLoading(false)
    fetchHelperData()
    fetchSubsData()
  }
  const handleCancel = () => {
    setModalOpen(false)
    setIsErrorModalOpen(false)
  }

  const openErrorModal = (message: string) => {
    Modal.error({
      title: 'Error',
      content: message,
    })
  }

  const redMarker = new Icon({
    iconUrl: redMarkerIcon,
    iconRetinaUrl: redMarkerIcon,
    popupAnchor: [0, -44],
    iconSize: [32, 45],
    iconAnchor: [17, 46],
  })
  const grayMarker = new Icon({
    iconUrl: grayMarkerIcon,
    iconRetinaUrl: grayMarkerIcon,
    popupAnchor: [0, -44],
    iconSize: [32, 45],
    iconAnchor: [17, 46],
  })

  const RelocateMap = ({helper}: PropType) => {
    const map = useMap()
    const x = parseFloat(helper.subsidiary.x_coordinate)
    const y = parseFloat(helper.subsidiary.y_coordinate)
    map.flyTo([x,y])
    return(
      <>
      </>
    )
  }

  return (
    <Spin spinning={isLoading}>
      <Row>
        <Col span={24}>
          <Card title="Mapa" style={{ width: '100%', height: '500px' }}>
            <MapContainer
              center={[-34.9135, -57.9463]}
              zoom={12}
              zoomControl={false}
              style={{ borderRadius: '5px', height: '400px' }}
            >
              {helperData && <RelocateMap helper={helperData}/>}
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {(helperData && subsData) && subsData.map((marcador) => (
                <Marker
                  key={marcador.id}
                  position={[
                    parseFloat(marcador.x_coordinate),
                    parseFloat(marcador.y_coordinate),
                  ]}
                  eventHandlers={{
                    click: () => handleMarkerClick(marcador, helperData),
                  }}
                  icon={marcador.active ? redMarker : grayMarker}
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
        okButtonProps={{disabled: isLoading}}
        cancelText="Cancelar"
        okText="Confirmar"
      >
        {(helperData && subSelected) && <>
          <p>¿Está seguro que quiere cambiar la filial de {helperData.full_name}? </p>
          <p>
            {'('}De '{helperData.subsidiary.name}' a '{subSelected.name}'
            {')'}
          </p>
        </>}
        
        {helperData && subSelected && helperData.subsidiary.cant_current_helpers === 1 ? 
        <p style={{fontWeight: "bold"}}>IMPORTANTE: Si {helperData.full_name} es cambiado de filial, la filial '{helperData.subsidiary.name}' se quedará sin ayudantes, por lo que se deshabilitará y se suspenderá todas las publicaciones relacionadas</p> : null}
      </Modal>
      <Modal
        title="Cambio de filial"
        open={isErrorModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Confirmar"
      >
      </Modal>
    </Spin>
  )
}
