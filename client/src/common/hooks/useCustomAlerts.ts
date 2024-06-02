import { App } from 'antd'

export function useCustomAlerts() {
  const { notification } = App.useApp()

  function notImplementedYet() {
    notification.error({
      message: 'Función no implementada',
      description:
        'Esta función estará disponible en futuras versiones del sistema',
      placement: 'topRight',
      duration: 3,
      style: { whiteSpace: 'pre-line' },
    })
  }

  function successNotification(
    message: React.ReactNode,
    description: React.ReactNode
  ) {
    notification.success({
      message,
      description,
      placement: 'topRight',
      duration: 3,
      style: { whiteSpace: 'pre-line' },
    })
  }

  function errorNotification(
    message: React.ReactNode,
    description: React.ReactNode
  ) {
    notification.error({
      message,
      description,
      placement: 'topRight',
      duration: 3,
      style: { whiteSpace: 'pre-line' },
    })
  }

  return { notImplementedYet, successNotification, errorNotification }
}
