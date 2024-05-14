import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Flex,
  Row,
} from 'antd'
import { useEffect, useState } from 'react'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet'
import { Icon } from 'leaflet'
import { ModalEditingSub } from '@Admin/components/ModalEditingSub'
import { ModalAddingSub } from '@Admin/components/ModalAddingSub'
import redMarkerIcon from '/map-pin-red.svg'
import grayMarkerIcon from '/map-pin-gray.svg'

type SubsidiaryType = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  active: boolean
}
type PropType = {
  title: string
  buttonName: string
  handleFunction: () => void
}

export function Locals() {
  const [subsData, setSubsData] = useState<SubsidiaryType[]>([
    {
      id: 0,
      name: '',
      x_coordinate: '0',
      y_coordinate: '0',
      max_helpers: 0,
      active: false,
    },
  ])

  const [idSelected, setIdSelected] = useState<number>(0)

  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false)
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false)

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Nombre',
      children: `${subsData[idSelected].name}`,
    },
    {
      key: '2',
      label: 'Cantidad máxima de ayudantes',
      children: `${subsData[idSelected].max_helpers}`,
    },
    {
      key: '3',
      label: 'Estado',
      children: `${subsData[idSelected].active ? 'Activa' : 'Inactiva'}`,
    },
  ]

  const fetchData = async () => {
    const res = await fetch('http://localhost:8000/subsidiary/subsidiaries/')
    const result = await res.json()
    setSubsData(result)
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleMarkerClick = (index: number) => {
    setIdSelected(index)
  }

  const handleAddingModal = () => {
    setIsAddingModalOpen(true)
  }

  const handleEditingModal = () => {
    setIsEditingModalOpen(true)
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

  function CardHeader({ title, buttonName, handleFunction }: PropType) {
    return (
      <Flex align="center" gap="small">
        <h3 style={{ marginRight: 'auto', marginBottom: '0' }}>{title}</h3>
        <Button type="primary" onClick={handleFunction}>
          {buttonName}
        </Button>
      </Flex>
    )
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Card
            title={
              <CardHeader
                title="Mapa"
                buttonName="Agregar filial"
                handleFunction={handleAddingModal}
              />
            }
            style={{ width: '100%', height: '500px' }}
          >
            <MapContainer
              center={[-34.9135, -57.9463]}
              zoom={12}
              zoomControl={false}
              style={{ borderRadius: '5px', height: '400px' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {subsData.map((marcador, index) => (
                <Marker
                  key={index}
                  position={[
                    parseFloat(marcador.x_coordinate),
                    parseFloat(marcador.y_coordinate),
                  ]}
                  eventHandlers={{
                    click: () => handleMarkerClick(index),
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
      <Row>
        <Col span={24}>
          {idSelected > 0 ? (
            <Card
              title={
                <CardHeader
                  title="Información de la filial"
                  buttonName="Editar"
                  handleFunction={handleEditingModal}
                />
              }
              style={{ marginBottom: '30px', marginTop: '10px' }}
            >
              <Descriptions
                bordered
                layout="horizontal"
                column={1}
                items={items}
                labelStyle={{ width: '35%' }}
              />
            </Card>
          ) : null}
        </Col>
      </Row>
      <ModalAddingSub
        subsData={subsData}
        isModalOpen={isAddingModalOpen}
        setIsModalOpen={setIsAddingModalOpen}
        fetchData={fetchData}
      ></ModalAddingSub>
      {idSelected > 0 ? (
        <ModalEditingSub
          subData={subsData[idSelected]}
          isModalOpen={isEditingModalOpen}
          setIsModalOpen={setIsEditingModalOpen}
          subsArray={subsData}
        ></ModalEditingSub>
      ) : null}
    </>
  )
}
