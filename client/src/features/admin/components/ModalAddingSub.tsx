import { fetchPost } from "@Common/helpers";
import { Flex, Input, InputNumber, Modal } from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { Icon, LatLng } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import blueMarkerIcon from "/map-pin-blue.svg"

type SubsidiaryType = {
    id: number,
    name: string,
    x_coordinate: string,
    y_coordinate: string,
    max_helpers: number,
    active: boolean
}
type DataType = {
    name: string
    x_coordinate: string
    y_coordinate: string
    max_helpers: number | null
    active: boolean
}
type PropType = {
    subsData: SubsidiaryType[]
    isModalOpen: boolean
    setIsModalOpen: (x:boolean) => void
    fetchData: () => void
}
type StatusType = {
    status: "" | "error"
    errorMessage: string
}

export function ModalAddingSub({subsData, isModalOpen, setIsModalOpen, fetchData}: PropType) {


    const [data, setData] = useState<DataType>({
        name: "",
        x_coordinate: "",
        y_coordinate: "",
        max_helpers: 1,
        active: false
    })

    const [position, setPosition] = useState<LatLng>()

    const [inputStatus, setInputStatus] = useState<StatusType>({
        status: "",
        errorMessage: ""
    })

    const [inputNumberStatus, setInputNumberStatus] = useState<StatusType>({
        status: "",
        errorMessage: ""
    })


    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(prevData => ({
            ...prevData,
            name: event.target.value
        }))
        if(!event.target.value){
            setInputStatus({
                status: "error",
                errorMessage: "El nombre es obligatorio"
            })
            return
        }
        if(subsData.some((item) => item.name === event.target.value)){
            setInputStatus({
                status: "error",
                errorMessage: `Ya hay una filial con el nombre "${event.target.value}"`
            })
            return
        }
        setInputStatus({
            status: "",
            errorMessage: ""
        })
    }
    const handleChangeCantHelpers = (value: number | null) => {
        setData(prevData => ({
            ...prevData,
            max_helpers: value
        }))
        if(value === null){
            setInputNumberStatus({
                status: "",
                errorMessage: "La cantidad de ayudantes es obligatoria"
            })
            return 
        }
        if(value <= 0){
            setInputNumberStatus({
                status: "error",
                errorMessage: "La cantidad debe ser mayor a 0"
            })
            return 
        }
        setInputNumberStatus({
            status: "",
            errorMessage: ""
        })
    }
    const handleChangeActive = (event: CheckboxChangeEvent) => {
        setData(prevData => ({
            ...prevData,
            active: event.target.checked
        }))
    }

    const handleOk = () => {
        console.log("OK", data)
        fetchPost("http://localhost:8000/subsidiary/subsidiary/",data)
        setIsModalOpen(false)
        fetchData()
    }
    const handleCancel = () => {
        console.log("CANCEL")
        setIsModalOpen(false)
    }

    const blueMarker = new Icon({
        iconUrl: blueMarkerIcon,
        iconRetinaUrl: blueMarkerIcon,
        popupAnchor: [0,0],
        iconSize:[32,45],
        iconAnchor: [17,46]
    })


    function LocationMarker() {
        useMapEvents({
          click(e) {
            const x:string = e.latlng.lat.toString()
            const y:string = e.latlng.lng.toString()
            setPosition(e.latlng) 
            setData(prevData => ({
              ...prevData,
              x_coordinate: x,
              y_coordinate: y
            }))
          },
        })
    
        return !position ? null : (
          <Marker position={position} 
            icon={blueMarker}
          />
        )
      }

  return (
    <>
      <Modal
        title="Agregando una filial"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancelar"
        okText="Confirmar"
        okButtonProps={{disabled: (data.name === "" || inputNumberStatus.status === "error" || (!data.x_coordinate && !data.y_coordinate))}}
      >
        <Flex vertical gap="25px">
        <p>Seleccione un lugar en el mapa</p>
        <div>
          <MapContainer
            center={[-34.9135, -57.9463]}
            zoom={12}
            zoomControl={false}
            style={{ borderRadius: '5px', height: '200px' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <LocationMarker />
          </MapContainer>
        </div >
            <label>Nombre: 
                <Input value={data.name} onChange={(event) => handleChangeName(event)} status={inputStatus.status}></Input>
                {inputStatus.status ? 
                    (<p style={{color:"#FF4D4F"}}>{inputStatus.errorMessage}</p>) : null}
            </label>
            <label>Cantidad máxima de ayudantes: <br/>
                <InputNumber value={data.max_helpers} status={inputNumberStatus.status} onChange={(value) => handleChangeCantHelpers(value)}></InputNumber>
                {inputNumberStatus.status ?
                    (<p style={{color: "#FF4D4F"}}>{inputNumberStatus.errorMessage}</p>) : null}
            </label>
            <Checkbox checked={data.active} onChange={(value) => handleChangeActive(value)}>Activa</Checkbox>
          <p>x: {data.x_coordinate} y:{data.y_coordinate}</p>
          {(!data.x_coordinate && !data.y_coordinate) ? 
            (<p style={{color: "#FF4D4F"}}>Seleccione un lugar en el mapa</p>) : null}
        </Flex>
      </Modal>
    </>
  )
}
