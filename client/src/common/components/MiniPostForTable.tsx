import { Image, Space } from 'antd'
import { SERVER_URL } from 'constants'
import { Link } from 'react-router-dom'

export function MiniPostForTable({
  record,
}: {
  record: { postId: number; postImg: string; postName: string }
}) {
  return (
    <>
      <Link to={`/posts/${record.postId}`}>
        <Space align="center">
          <Image
            height={'50px'}
            width={'50px'}
            style={{ borderRadius: '5px', objectFit: 'contain' }}
            src={`${SERVER_URL}${record.postImg}`}
            preview={false}
          ></Image>
          <p style={{ marginBottom: '0' }}>{record.postName}</p>
        </Space>
      </Link>
    </>
  )
}
