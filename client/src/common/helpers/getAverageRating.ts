import { UserRatingModel } from '@Common/api'

export function getAverageRating(ratings: UserRatingModel[]) {
  if (ratings.length === 0) return 0
  return ratings.reduce((acc, { score }) => acc + score, 0) / ratings.length
}
