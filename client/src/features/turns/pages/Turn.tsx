import { ButtonCancelarTurno } from '@Turns/components/ButtonCancelarTurno'
import { CalendarTurn } from '@Turns/components/CalendarTurn'
import { ModalCancelarTurno } from '@Turns/components/ModalCancelarTurno'
import { Button, Card, Flex, Space } from 'antd'
import { useState } from 'react'

export function Turn() {
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [turnSelected, setTurnSelected] = useState({
    id: 0,
    date: '00/00/0000',
    subsidiary: 'asdf qwer',
    confirmed: true,
  })

  function ButtonConfirmTurn() {
    return (
      <>
        <Button type="primary">Confirmar</Button>
      </>
    )
  }
  function ButtonRescheduleTurn() {
    return (
      <>
        <Button>Aplazar</Button>
      </>
    )
  }

  return (
    <>
      <Card
        title={
          <>
            <Flex align="center" style={{ marginBottom: '0' }}>
              <h3
                style={{
                  fontWeight: 'bold',
                  marginBottom: '0',
                  marginRight: 'auto',
                }}
              >
                Info del turno
              </h3>
              <Space size={'large'}>
                <ButtonRescheduleTurn></ButtonRescheduleTurn>

                <ButtonCancelarTurno
                  record={{
                    id: 0,
                    date: '00/00/0000',
                    subsidiary: 'asdfqwer',
                    confirmed: true,
                  }}
                  setModalOpen={setModalOpen}
                  setTurnSelected={setTurnSelected}
                  buttonText="Cancelar"
                ></ButtonCancelarTurno>

                <ButtonConfirmTurn></ButtonConfirmTurn>
              </Space>
            </Flex>
          </>
        }
      >
        <Flex align="center" style={{ marginBottom: '10px' }}>
          <h3
            style={{
              fontWeight: 'bold',
              marginBottom: '0',
              marginRight: 'auto',
            }}
          >
            Fecha del turno: {turnSelected.date}
          </h3>
        </Flex>
        <CalendarTurn></CalendarTurn>
      </Card>

      <ModalCancelarTurno
        turnEstate={turnSelected?.confirmed}
        loading={loading}
        setLoading={setLoading}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      ></ModalCancelarTurno>
    </>
  )
}
