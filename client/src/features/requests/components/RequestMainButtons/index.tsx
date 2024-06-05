import { RequestModel } from '@Common/api'
import { useAuth } from '@Common/hooks'
import { ButtonsMaker } from './ButtonsMaker'
import { ButtonReceiver } from './ButtonsReceiver'

export function RequestMainButton({ request }: { request: RequestModel }) {
  const { user } = useAuth()

  if (user!.id === request.user_maker) {
    return <ButtonsMaker request={request} />
  }
  return <ButtonReceiver request={request} />
}
