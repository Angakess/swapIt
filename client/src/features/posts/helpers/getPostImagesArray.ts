import { PostModel } from '@Common/api'

export function getPostImagesArray(post: PostModel): string[] {
  return Object.entries(post)
    .filter(([key, value]) => key.startsWith('image_') && value != null)
    .map(([, value]) => value) as string[]
}
