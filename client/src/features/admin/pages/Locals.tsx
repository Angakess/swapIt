import { Button, Card, Checkbox, Col, Descriptions, DescriptionsProps, Flex, Form, FormProps, Input, InputNumber, Modal, Row } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { LatLngExpression } from 'leaflet'
import { ModalEditingSub } from "@Admin/components/ModalEditingSub";
import { ModalAddingSub } from "@Admin/components/ModalAddingSub";

type SubsidiaryType = {
  id: number,
  name: string,
  x_coordinate: string,
  y_coordinate: string,
  max_helpers: number,
  active: boolean
}
type PropType = {
  title: string
  buttonName: string
  handleFunction: () => void
}
type NewSubData = {
  name: string
  x_coordinate: string
  y_coordinate: string
  max_helpers: number
  active: boolean
}
type EditedDataType = {
  id: number
  name: string
  max_helpers: number | null
  active: boolean
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

  const [newSubData, setNewSubData] = useState<NewSubData>({
    name: "",
    x_coordinate: "",
    y_coordinate: "",
    max_helpers: 0,
    active: false
  })
  const [newEditedSubData, setNewEditedSubData] = useState<EditedDataType>({
    id: 0,
    name: "",
    max_helpers: 0,
    active: false
  })


  const [locationSelected, setLocationSelected] = useState<LatLngExpression>()

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
      children: `${subsData[idSelected].active ? "Activa" : "Inactiva"}`,
    }
  ]

  const fetchData = async() => {
    const res = await fetch("http://localhost:8000/subsidiary/subsidiaries/")
    const result = await res.json()
    setSubsData(result)
  }
  useEffect(() => {fetchData()},[])
  
  const handleMarkerClick = (index:number) => {
    setIdSelected(index)
    setNewEditedSubData({
      id: index,
      name: subsData[index].name,
      max_helpers: subsData[index].max_helpers,
      active: subsData[index].active
    })
  }

  const handleAddingModal = () => {
    setIsAddingModalOpen(true)
  }
  const handleOkAdding = () => {
    console.log("se agrego")
  }
  const handleCancelAdding = () => {
    setIsAddingModalOpen(false)
  }

  const handleEditingModal = () => {
    setIsEditingModalOpen(true)
  }
  const handleOkEditing = () => {
    console.log("se edito: ", newEditedSubData)
    fetchData()
    setIsEditingModalOpen(false)
  }
  const handleCancelEditing = () => {
    setIsEditingModalOpen(false)
  }


  const subNameValidator = () => {
    if(subsData.some(item => item.name === newEditedSubData.name)){
      return Promise.reject(new Error("Ya existe una filial con ese nombre"))
    }
    return Promise.resolve()
  }
  const subHelperCantValidator = () => {
    if((!newEditedSubData.max_helpers)||( 0 >= newEditedSubData.max_helpers)){
      return Promise.reject(new Error("El número ingresado no es válido"))
    }
    //Cambiar 5 por subsData[idSelected].current_helpers
    if( 5 > newEditedSubData.max_helpers){
      return Promise.reject(new Error("El límite de ayudantes no puede ser inferior a la cantidad de ayudantes asignados"))
    }
    return Promise.resolve()
  }

  const handleChangeInputName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEditedSubData(prevNewData => ({
      ...prevNewData,
      name: event.target.value
    }))
  }
  const handleChangeInputCantHelpers = (value: number | null) => {
    setNewEditedSubData(prevNewData => ({
      ...prevNewData,
      max_helpers: value
    }))
  }
  const handleChangeCheckbox = (value: CheckboxChangeEvent) => {
    setNewEditedSubData(prevNewData => ({
      ...prevNewData,
      active: value.target.checked
    }))
  }

  const handleAddFormFinish: FormProps['onFinish'] = () => {
    console.log("Success adding")
  }
  const handleAddFormFinishFailed: FormProps['onFinish'] = () => {
    console.log("Failed adding")
  }

  const handleEditFormFinish: FormProps['onFinish'] = () => {
    console.log("Success adding")
  }
  const handleEditFormFinishFailed: FormProps['onFinish'] = () => {
    console.log("Failed adding")
  }


  function CardHeader({ title, buttonName, handleFunction }: PropType) {

    return (
      <Flex align="center" gap="small">
        <h3 style={{ marginRight: 'auto', marginBottom: "0" }}>{title}</h3>
        <Button type='primary' onClick={handleFunction}>{buttonName}</Button>
      </Flex>
    )
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const x:string = e.latlng.lat.toString()
        const y:string = e.latlng.lng.toString()
        setLocationSelected(e.latlng) 
        setNewSubData(prevNewData => ({
          ...prevNewData,
          x_coordinate: x,
          y_coordinate: y
        }))
      },
    })

    return !locationSelected ? null : (
      <Marker position={locationSelected}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Card 
            title={<CardHeader 
              title="Mapa"
              buttonName="Agregar filial"
              handleFunction={handleAddingModal}
              />} 
            style={{ width: '100%', height: '500px' }}>
            <MapContainer
              center={[-35, -58]}
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
          {idSelected > 0 ? (<Card title={<CardHeader 
            title="Información de la filial"
            buttonName="Editar"
            handleFunction={handleEditingModal}
          />}
            style={{marginBottom: "30px", marginTop: "10px"}}
          >
            <Descriptions 
              bordered
              layout="horizontal"
              column={1}
              items={items}
              labelStyle={{ width: '35%' }}
            />
          </Card>) : null}
        </Col>
      </Row>
      <ModalAddingSub
        subsData={subsData}
        isModalOpen={isAddingModalOpen}
        setIsModalOpen={setIsAddingModalOpen}
      >

      </ModalAddingSub>
      {/* <Modal
        title="Agregando una filial"
        open={isAddingModalOpen}
        onOk={handleOkAdding}
        onCancel={handleCancelAdding}
        cancelText="Cancelar"
        okText="Confirmar"
      >
        <Flex vertical gap="25px">
        <p>Seleccione un lugar en el mapa</p>
        <div>
          <MapContainer
            center={[-35, -58]}
            zoom={12}
            zoomControl={false}
            style={{ borderRadius: '5px', height: '200px' }}
            
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <LocationMarker />
            
          </MapContainer>
        </div >
        
            <label>Nombre: <Input value={newEditedSubData.name} onChange={(event) => handleChangeInputName(event)}></Input>{!newSubData.name ? (<p style={{color:"#FF4D4F"}}>El nombre es obligatorio</p>) : null}</label>
          
            <label>Cantidad máxima de ayudantes: <br/><InputNumber value={newEditedSubData.max_helpers} onChange={(value) => handleChangeInputCantHelpers(value)}></InputNumber></label>
            <Checkbox defaultChecked={newEditedSubData.active} onChange={(value) => handleChangeCheckbox(value)}>Activa</Checkbox>
          <p>x: {newSubData.x_coordinate} y:{newSubData.y_coordinate}</p>
          {(!newSubData.x_coordinate && !newSubData.y_coordinate) ? (<p style={{color: "#FF4D4F"}}>Seleccione un lugar en el mapa</p>) : null}
        </Flex>
        
          
      </Modal> */}
      {idSelected > 0 ? (<ModalEditingSub
        subData={subsData[idSelected]}
        isModalOpen={isEditingModalOpen}
        setIsModalOpen={setIsEditingModalOpen}
      ></ModalEditingSub>) : null}
      


      {/* <Modal
        title="Editando una filial"
        open={isEditingModalOpen}
        onOk={handleOkEditing}
        onCancel={handleCancelEditing}
        cancelText="Cancelar"
        okText="Aplicar cambios"
      >
        <Form
          layout="vertical"
          onFinish={handleEditFormFinish}
          onFinishFailed={handleEditFormFinishFailed}
        >
          <Form.Item
            label="Nombre"
            required={false}
            rules={[{required: true, message:"El nombre es obligatorio"},
                    {validator: subNameValidator}
            ]}
          >
            <Input value={newEditedSubData.name} onChange={(event) => handleChangeInputName(event)}></Input>
          </Form.Item>
          <Form.Item
            label="Cantidad de ayudantes máximo"
            rules={[{required: true, message:"Este campo es obligatorio"},
                    {validator: subHelperCantValidator}
            ]}
          >
            <InputNumber value={newEditedSubData.max_helpers} onChange={(value) => handleChangeInputCantHelpers(value)}></InputNumber>
          </Form.Item>
          <Form.Item>
            <Checkbox defaultChecked={newEditedSubData.active} onChange={(value) => handleChangeCheckbox(value)}>Activa</Checkbox>
          </Form.Item>
        </Form>
      </Modal> */}
    </>
  )
}
