import {
  Button,
  Card,
  Col,
  Descriptions,
  DescriptionsProps,
  Empty,
  Flex,
  Row,
  Tooltip,
} from 'antd'
import { ReloadOutlined, GoldOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Icon } from 'leaflet'
import { ModalEditingSub } from '@Admin/components/ModalEditingSub'
import { ModalAddingSub } from '@Admin/components/ModalAddingSub'
import redMarkerIcon from '/map-pin-red.svg'
import grayMarkerIcon from '/map-pin-gray.svg'
import Input, { SearchProps } from 'antd/es/input'
import { useCustomAlerts } from '@Common/hooks'
import { PageTitle } from '@Common/components'
import { Link } from 'react-router-dom'

type SubsidiaryType = {
  id: number
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number | null
  cant_current_helpers: number
  active: boolean
}
type PropType = {
  title: string
  buttonName: string
  handleFunction: () => void
}

export function Locals() {
  const alert = useCustomAlerts()

  const { Search } = Input

  const [subsData, setSubsData] = useState<SubsidiaryType[]>()

  const [subSelected, setSubSelected] = useState<SubsidiaryType>()

  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false)
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false)

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Nombre',
      children: `${subSelected?.name}`,
    },
    {
      key: '2',
      label: 'Cantidad máxima de ayudantes',
      children: `${subSelected?.max_helpers}`,
    },
    {
      key: '3',
      label: 'Cantidad actual de ayudantes',
      children: `${subSelected?.cant_current_helpers}`,
    },
    {
      key: '4',
      label: 'Estado',
      children: `${subSelected?.active ? 'Activa' : 'Inactiva'}`,
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

  const handleMarkerClick = (marcador: SubsidiaryType) => {
    setSubSelected(marcador)
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

  const handleSearch: SearchProps['onSearch'] = async (value, _e) => {
    const res = await fetch(
      'http://localhost:8000/subsidiary/subsidiaries/?' +
        new URLSearchParams({
          search: value,
        })
    )
    const result = await res.json()
    setSubsData(result)
    setSubSelected(undefined)
  }
  /*TODO: Implementar la funcionalidad de listar stock. Endpoint: /stock/retrieve/<int:pk>
  pk es el id de la filial seleccionada. 
  Respuesta: 
  {
    "ok": true,
    "messages": [
        "Stock de la filial 2 obtenido correctamente"
    ],
    "data": [
        {
            "id": 6,
            "categoria": {
                "id": 1,
                "name": "útiles escolares",
                "active": true
            },
            "filial": {
                "id": 2,
                "name": "Nuestra Señora de La Piedad",
                "x_coordinate": "-34.94271621425516",
                "y_coordinate": "-57.95568044237283",
                "max_helpers": 5,
                "cant_current_helpers": 4,
                "active": true
            },
            "cantidad": 0
        },
      ]
  }
        
  Para actualizar un stock hacer un PUT a /stock/update/<int:pk> con el siguiente body:
  {
    "id": 2,
    "cantidad": 50,
    "categoria": 2,
    "filial": 1
  }
  */
  const handleListStock = () => {
    alert.notImplementedYet()
  }

  function CardHeader({ title, buttonName, handleFunction }: PropType) {
    return (
      <Flex align="center" gap="small">
        <h3 style={{ marginRight: 'auto', marginBottom: '0' }}>{title}</h3>
        <Search
          placeholder="Ingrese el nombre de la filial que desea buscar"
          onSearch={handleSearch}
          style={{ width: '60%' }}
        />
        <Button
          onClick={() => {
            fetchData()
            setSubSelected(undefined)
          }}
          icon={<ReloadOutlined />}
        ></Button>
        <Button onClick={handleFunction} type="primary">
          {buttonName}
        </Button>
      </Flex>
    )
  }

  return (
    <>
      <PageTitle title="Filiales" />
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
            {subsData && subsData?.length > 0 ? (
              <MapContainer
                center={[-34.9135, -57.9463]}
                zoom={12}
                zoomControl={false}
                style={{ borderRadius: '5px', height: '400px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {subsData &&
                  subsData.map((marcador) => (
                    <Marker
                      key={marcador.id}
                      position={[
                        parseFloat(marcador.x_coordinate),
                        parseFloat(marcador.y_coordinate),
                      ]}
                      eventHandlers={{
                        click: () => handleMarkerClick(marcador),
                      }}
                      icon={marcador.active ? redMarker : grayMarker}
                    >
                      <Popup>{marcador.name}</Popup>
                    </Marker>
                  ))}
              </MapContainer>
            ) : (
              <Empty description={<p>No hay filiales disponibles</p>} />
            )}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {subSelected ? (
            <Card
              title={
                <>
                  <Flex align="center" gap="small">
                    <h3 style={{ marginRight: 'auto', marginBottom: '0' }}>
                      Información de la filial
                    </h3>
                    <Button onClick={handleEditingModal}>Editar</Button>
                    <Tooltip title="Listar stock">
                      <Link to={`/admin/locals/${subSelected.id}`}>
                      <Button
                        icon={<GoldOutlined />}
                        /* onClick={handleListStock} */
                      >Stock</Button>
                      </Link>
                      
                    </Tooltip>
                  </Flex>
                </>
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
      {subsData ? (
        <ModalAddingSub
          subsData={subsData}
          isModalOpen={isAddingModalOpen}
          setIsModalOpen={setIsAddingModalOpen}
          fetchData={fetchData}
        ></ModalAddingSub>
      ) : null}
      {subSelected && subsData ? (
        <ModalEditingSub
          subData={subSelected}
          isModalOpen={isEditingModalOpen}
          setIsModalOpen={setIsEditingModalOpen}
          subsArray={subsData}
          fetchData={fetchData}
          setSubSelected={setSubSelected}
        ></ModalEditingSub>
      ) : null}
    </>
  )
}
