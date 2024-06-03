import { fetchPost } from '@Common/helpers'
import { Button, Modal } from 'antd'

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
  async function handleClick() {
    setLoading(true)
    console.log(inputCodes)

    const res = await fetchPost('http://localhost:8000/turns/validate', {
      id_turn: idTurn,
      code_maker: inputCodes.inputA,
      code_received: inputCodes.inputB,
    })
    const result = await res.json()
    if (res.ok) {
      Modal.success({
        title: 'Operación completada',
        content: result.messages,
      })
    } else {
      Modal.error({
        title: 'Operación fallida',
        content: result.messages,
      })
    }

    setLoading(false)
    setExist(false)
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
