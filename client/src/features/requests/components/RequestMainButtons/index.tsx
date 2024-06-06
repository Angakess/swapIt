import { RequestModel } from '@Common/api'
import { useAuth } from '@Common/hooks'
import { ButtonsMaker } from './ButtonsMaker'
import { ButtonReceiver } from './ButtonsReceiver'

type RequestMainButtonProps = {
  request: RequestModel
  setRequest: React.Dispatch<React.SetStateAction<RequestModel | null>>
}

export function RequestMainButton({
  request,
  setRequest,
}: RequestMainButtonProps) {
  const { user } = useAuth()

  if (user!.id === request.user_maker) {
    return <ButtonsMaker request={request} setRequest={setRequest} />
  }
  return <ButtonReceiver request={request} setRequest={setRequest} />
}
