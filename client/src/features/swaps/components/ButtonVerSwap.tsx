import { Button, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { InfoCircleOutlined } from '@ant-design/icons'

export function ButtonVerSwap({ swapId }: { swapId: number }) {
  return (
    <>
      <Tooltip title="Ver trueque">
        <Link to={`/swaps/${swapId}`}>
          <Button type="primary" icon={<InfoCircleOutlined />}></Button>
        </Link>
      </Tooltip>
    </>
  )
}
