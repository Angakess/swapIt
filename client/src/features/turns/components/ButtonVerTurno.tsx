import { Button, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { CalendarFilled } from '@ant-design/icons'

export function ButtonVerTurno({ turnId }: { turnId: number }) {
    return (
      <>
      <Tooltip title="Ver turno">
      <Link to={`/admin/exchangers/${turnId}`}>
          <Button type="primary" icon={<CalendarFilled />}></Button>
        </Link>
      </Tooltip>
      </>
    )
  }