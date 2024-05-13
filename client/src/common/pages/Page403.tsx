import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

export function Page403() {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="403 - Acceso denegado"
      subTitle="Lo sentimos, no cuentas con los permisos necesarios para acceder a esta página."
      extra={
        <Button type="primary" onClick={() => navigate('/', { replace: true })}>
          Volver
        </Button>
      }
    />
  )
}
