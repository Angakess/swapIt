import { useAuth } from '@Common/hooks'
import { PostModel } from '@Common/api'
import { ExchangerButtons } from './ExchangerButtons'
import { StaffButtons } from './StaffButtons'
import { OwnerButtons } from './OwnerButtons'

type PostMainButtonProps = {
  post: PostModel
  setPost: React.Dispatch<React.SetStateAction<PostModel | null>>
}

export function PostMainButton({ post, setPost }: PostMainButtonProps) {
  const { user } = useAuth()

  if (user!.role === 'EXCHANGER') {
    if (user!.id === post.user.id) {
      return <OwnerButtons post={post} setPost={setPost} />
    }
    return <ExchangerButtons />
  }

  return <StaffButtons post={post} />
}
