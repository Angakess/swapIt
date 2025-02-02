import { Button } from 'antd'
import { useState } from 'react'
import { ExchangePostModal } from '../ExchangePostModal'
import { PostModel } from '@Common/api'

type ExchangerButtonsProps = {
  post: PostModel
}

export function ExchangerButtons({ post }: ExchangerButtonsProps) {
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false)

  if (post.state.name === 'sin-stock') {
    return null
  }

  return (
    <>
      <Button
        type="primary"
        block
        size="large"
        style={{ fontWeight: '700', marginBottom: '1.5rem' }}
        onClick={() => setIsExchangeModalOpen(true)}
      >
        Intercambiar
      </Button>
      <ExchangePostModal
        postReceiver={post}
        isOpen={isExchangeModalOpen}
        setIsOpen={setIsExchangeModalOpen}
      />
    </>
  )
}
