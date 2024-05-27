import { Button } from 'antd'
import { useCustomAlerts } from '@Common/hooks'

export function ExchangerButtons() {
  const alerts = useCustomAlerts()

  return (
    <Button
      type="primary"
      block
      size="large"
      style={{ fontWeight: '700', marginBottom: '1.5rem' }}
      onClick={alerts.notImplementedYet}
    >
      Intercambiar
    </Button>
  )
}
