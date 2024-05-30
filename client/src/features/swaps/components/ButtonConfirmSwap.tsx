import { Button } from 'antd'

export function ButtonConfirmSwap({
  confirmDisabled,
  inputCodes,
  loading,
  setLoading,
}: {
  confirmDisabled: boolean
  inputCodes: { inputA: string; inputB: string }
  loading: boolean
  setLoading: (x: boolean) => void
}) {
  function handleClick() {
    setLoading(true)
    console.log(inputCodes)
    setTimeout(() => setLoading(false), 3000)
    
  }

  return (
    <>
      <Button
        type="primary"
        disabled={confirmDisabled || loading}
        onClick={handleClick}
      >
        Confirmar
      </Button>
    </>
  )
}
