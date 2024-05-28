import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import blueMarkerIcon from '/map-pin-blue.svg'
import { Icon } from "leaflet";

type subType = {
    id: number
    name: string
    x_coordinate: string
    y_coordinate: string
}

export function MapWithTurn({sub}: {sub: subType}){


    const RelocateMap = () => {
        const map = useMap()
        const x = parseFloat(sub.x_coordinate)
        const y = parseFloat(sub.y_coordinate)
        map.flyTo([x, y])
        return <></>
      }
    const blueMarker = new Icon({
        iconUrl: blueMarkerIcon,
        iconRetinaUrl: blueMarkerIcon,
        popupAnchor: [0, -44],
        iconSize: [32, 45],
        iconAnchor: [17, 46],
      })

    return (
        <MapContainer
                center={[-34.9135, -57.9463]}
                zoom={12}
                zoomControl={false}
                style={{ borderRadius: '5px', height: '300px'}}
              >
                <RelocateMap></RelocateMap>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      key={sub.id}
                      position={[
                        parseFloat(sub.x_coordinate),
                        parseFloat(sub.y_coordinate),
                      ]}
                      icon={blueMarker}
                    >
                      <Popup>{sub.name}</Popup>
                    </Marker>
              </MapContainer>
    )
}