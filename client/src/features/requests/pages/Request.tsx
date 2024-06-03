import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'

import { RequestModel, getRequestById } from '@Common/api'
import { useAuth } from '@Common/hooks'
import { Page404 } from '@Common/pages'

export function Request() {
  const { id } = useParams()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [request, setRequest] = useState<RequestModel | null>(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const resp = await getRequestById(parseInt(id!, 10))
      setRequest(resp)
      setIsLoading(false)
    })()
  }, [id])

  // Si está cargando, mostrar spin de carga:
  if (isLoading) {
    return <Spin size="large" style={{ width: '100%' }} />
  }

  // Si:
  // - la request no existe
  // - o el usuario no está involucrado
  // entonces: 404.
  if (
    request === null ||
    ![request.user_maker, request.user_receive].includes(user!.id)
  ) {
    return <Page404 />
  }

  // Cualquier otro caso, mostrar el componente:

  return <p>una request</p>
}
