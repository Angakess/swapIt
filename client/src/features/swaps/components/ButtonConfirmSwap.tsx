import { fetchPost } from '@Common/helpers'
import { useCustomAlerts } from '@Common/hooks'
import { Button, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

export function ButtonConfirmSwap({
  confirmDisabled,
  idTurn,
  inputCodes,
  loading,
  setLoading,
  existe,
  setExist,
}: {
  confirmDisabled: boolean
  idTurn: number
  inputCodes: { inputA: string; inputB: string }
  loading: boolean
  setLoading: (x: boolean) => void
  existe: boolean
  setExist: (x: boolean) => void
}) {

  const miniModal = useCustomAlerts()

  const navigate = useNavigate()

  async function handleClick() {
    setLoading(true)
    console.log(inputCodes)

    const res = await fetchPost('http://localhost:8000/turns/validate/', {
      id_turn: idTurn,
      code_maker: inputCodes.inputA,
      code_received: inputCodes.inputB,
    })
    const result = await res.json()
    if(res.ok){
      miniModal.successNotification("Operación realizada con éxito",result.messages[0])
      setExist(false)
      navigate("/swaps",{replace: true})
    }
    else{
      miniModal.errorNotification("Operación fallida",result.messages[0]
      )
    }
    setLoading(false)
  }

  return (
    <>
      <Button
        type="primary"
        disabled={confirmDisabled || loading || !existe}
        onClick={handleClick}
      >
        Confirmar
      </Button>
    </>
  )
}
