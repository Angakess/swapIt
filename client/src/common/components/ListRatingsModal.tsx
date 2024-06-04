import { UserRatingModel } from '@Common/api'
import { Avatar, Flex, List, Modal, Rate } from 'antd'
import { SetStateAction } from 'react'

type ListRatingsModalProps = {
  title: string
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  ratings: UserRatingModel[]
  isLoading?: boolean
}

export function ListRatingsModal({
  title,
  isOpen,
  setIsOpen,
  ratings,
  isLoading = false,
}: ListRatingsModalProps) {
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <List
        size="large"
        loading={isLoading}
        dataSource={ratings}
        renderItem={(rating) => <RatingItem rating={rating} />}
      />
    </Modal>
  )
}

function RatingItem({ rating }: { rating: UserRatingModel }) {
  const {
    comment,
    score,
    user_maker: { first_name, last_name },
  } = rating

  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <Avatar style={{ backgroundColor: '#D02F4C' }}>
            {(first_name[0] + last_name[0]).toUpperCase()}
          </Avatar>
        }
        title={
          <Flex justify="space-between" align="start" vertical>
            <span>
              {first_name} {last_name}
            </span>
            <span>
              <Rate disabled defaultValue={score} allowHalf />
            </span>
          </Flex>
        }
        description={comment}
      />
    </List.Item>
  )
}
