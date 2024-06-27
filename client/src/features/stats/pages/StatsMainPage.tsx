import { PageTitle } from '@Common/components'
import { Card } from 'antd'
import { Link } from 'react-router-dom'

export default function StatsMainPage() {
  return (
    <>
      <PageTitle title="Estadísticas" />
      <Card>
        <ul style={{ margin: 0, lineHeight: 2 }}>
          <li>
            <Link to="/admin/stats/posts">Estadísticas de publicaciones</Link>
          </li>
          <li>
            <Link to="/admin/stats/exchangers">
              Estadísticas de intercambiadores
            </Link>
          </li>
          <li>
            <Link to="/admin/stats/locals">Estadísticas de filiales</Link>
          </li>
          <li>
            <Link to="/admin/stats/categories">Estadísticas de categorías</Link>
          </li>
        </ul>
      </Card>
    </>
  )
}
