import { Image, Space } from 'antd'
import { Link } from 'react-router-dom'

export function MiniPostForList({
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
            style={{ borderRadius: '5px' }}
            src={`http://localhost:8000${record.postImg}`}
            preview={false}
          ></Image>
          <p style={{ marginBottom: '0' }}>{record.postName}</p>
        </Space>
      </Link>
    </>
  )
}
