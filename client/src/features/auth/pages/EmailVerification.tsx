import { Button, Result, Spin } from 'antd'
import { AuthTitle } from '@Auth/components'
import { useEffect, useState } from 'react'
import { fetchPost } from 'common/helpers'
import { Link, useParams } from 'react-router-dom'

type VerificationStatus = 'checking' | 'valid' | 'invalid'

export function EmailVerification() {
  const { code } = useParams()
  const [status, setStatus] = useState<VerificationStatus>('checking')

  useEffect(() => {
    ;(async () => {
      const resp = await fetchPost('http://localhost:8000/users/activate/', {
        code,
      })
      console.log('resp', resp)
      const data = await resp.json()
      console.log('data', data)
      setStatus(data.ok ? 'valid' : 'invalid')
    })()
  }, [])

  return (
    <>
      <AuthTitle>Verificación de correo</AuthTitle>
      <Checking status={status} />
    </>
  )
}

function Checking({ status }: { status: VerificationStatus }) {
  if (status === 'checking') {
    return (
      <Result
        status="info"
        icon={<Spin size="large" />}
        title="Verificando correo..."
      />
    )
  }

  if (status === 'valid') {
    return (
      <Result
        status="success"
        title="Su correo ha sido verificado correctamente"
        extra={
          <Button type="primary" size="middle">
            <Link to={'/auth/login'}>Ir a iniciar sesión</Link>
          </Button>
        }
      />
    )
  }

  if (status === 'invalid') {
    return (
      <Result
        status="error"
        title="Código de verificación inválido"
        subTitle="Este error puede ocurrir si tu cuenta ya está validada o si el código de verificación es incorrecto"
        extra={
          <Button type="primary" size="middle">
            <Link to={'/auth/login'}>Ir a iniciar sesión</Link>
          </Button>
        }
      />
    )
  }
}
