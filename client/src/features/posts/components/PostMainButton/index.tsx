import { useAuth } from '@Common/hooks'
import { PostModel } from '@Common/api'
import { ExchangerButtons } from './ExchangerButtons'
import { StaffButtons } from './StaffButtons'
import { OwnerButtons } from './OwnerButtons'

export function PostMainButton({ post }: { post: PostModel }) {
  const { user } = useAuth()

  if (user!.role === 'EXCHANGER') {
    if (user!.id === post.user.id) {
      return <OwnerButtons post={post} />
    }
    return <ExchangerButtons />
  }

  return <StaffButtons post={post} />
}
