import { Route, Routes } from 'react-router-dom'
import {
  UserOutlined,
  ContactsOutlined,
  ProductOutlined,
  ShopOutlined,
} from '@ant-design/icons'

import { Categories, ChangeLocal, ExchangerProfile, Exchangers, Helpers, Locals } from '@Admin/pages'
import { AppLayout } from 'layout'

export function AdminRoutes() {
  return (
    <>
      <AppLayout
        sidebarProps={{
          defaultSelectedKey: 'helpers',
          menuItems: [
            {
              key: '/admin/helpers',
              label: 'Ayudantes',
              icon: <ContactsOutlined />,
            },
            {
              key: '/admin/exchangers',
              label: 'Intercambiadores',
              icon: <UserOutlined />,
            },
            {
              key: '/admin/locals',
              label: 'Filiales',
              icon: <ShopOutlined />,
            },
            {
              key: '/admin/categories',
              label: 'Categorias',
              icon: <ProductOutlined />,
            },
          ],
        }}
      >
        <Routes>
          <Route path="/helpers" element={<Helpers />} />
          <Route path="/helpers/change-local/:id" element={<ChangeLocal />}/>
          <Route path="/exchangers" element={<Exchangers />} />
          <Route path='/exchangers/:id' element={<ExchangerProfile />} />
          <Route path="/locals" element={<Locals />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </AppLayout>
    </>
  )
}
