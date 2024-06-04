import { UserRatingModel, getUserRatings } from '@Common/api'
import { ListRatingsModal } from '@Common/components'
import { UserAvatar } from '@Common/components/UserAvatar'
import { getAverageRating } from '@Common/helpers'
import { StarFilled } from '@ant-design/icons'
import { Flex, Space, Spin, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'

type PostUserProps = {
  userId: number
  firstName: string
  lastName: string
}

export function PostUser({ userId, firstName, lastName }: PostUserProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [ratings, setRatings] = useState<UserRatingModel[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getUserRatings(userId).then((fetchedRatings) => {
      setRatings(fetchedRatings)
      setIsLoading(false)
    })
  }, [userId])

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        style={{ cursor: 'pointer' }}
        onClick={() => !isLoading && setIsModalOpen(true)}
      >
        <UserAvatar firstName={firstName} lastName={lastName} size="large" />
        <Stars isLoading={isLoading} ratings={ratings} />
      </Flex>
      <ListRatingsModal
        title={`Calificaciones de ${firstName} ${lastName}`}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        ratings={ratings}
      />
    </>
  )
}

function Stars({
  isLoading,
  ratings,
}: {
  isLoading: boolean
  ratings: UserRatingModel[]
}) {
  const { colorPrimary } = theme.useToken().token

  if (isLoading) return <Spin style={{ height: '20px' }} />

  return (
    <Space>
      <StarFilled style={{ color: colorPrimary, fontSize: '1.25em' }} />
      <Typography.Text>
        {getAverageRating(ratings).toFixed(2)}{' '}
        <Typography.Text italic type="secondary">
          ({ratings.length})
        </Typography.Text>
      </Typography.Text>
    </Space>
  )
}
