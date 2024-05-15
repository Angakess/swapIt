import { useAuth } from '@Common/hooks'
import { PostsExchanger, PostsStaff } from '@Posts/components'

export function Posts() {
  const { user } = useAuth()

  if (user!.role === 'EXCHANGER') {
    return <PostsExchanger />
  }

  return <PostsStaff />
}
