import { useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'

export function Page404() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404 - Página no encontrada"
      subTitle="Lo sentimos, la página que ha visitado no existe."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      }
    />
  )
}
