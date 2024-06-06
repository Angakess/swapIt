import { useAuth } from '@Common/hooks'
import { PostModel } from '@Common/api'
import { ExchangerButtons } from './ExchangerButtons'
import { StaffButtons } from './StaffButtons'
import { OwnerButtons } from './OwnerButtons'

type PostMainButtonProps = {
  post: PostModel
  setPost: React.Dispatch<React.SetStateAction<PostModel | null>>
  isEditable: boolean
}

export function PostMainButton({
  post,
  setPost,
  isEditable,
}: PostMainButtonProps) {
  const { user } = useAuth()

  if (user!.role === 'EXCHANGER') {
    if (user!.id === post.user.id) {
      return (
        <OwnerButtons post={post} setPost={setPost} isEditable={isEditable} />
      )
    }
    return <ExchangerButtons post={post} />
  }

  return <StaffButtons post={post} />
}
