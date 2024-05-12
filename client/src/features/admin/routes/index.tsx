import { Route, Routes } from 'react-router-dom'
import {
  UserOutlined,
  ContactsOutlined,
  ProductOutlined,
  ShopOutlined,
} from '@ant-design/icons'

import {
  Categories,
  ExchangerAccount,
  Exchangers,
  Helpers,
  Locals,
} from '@Admin/pages'
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
          <Route path="/exchangers" element={<Exchangers />} />
          <Route path="/exchangers/:id" element={<ExchangerAccount />} />
          <Route path="/locals" element={<Locals />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </AppLayout>
    </>
  )
}
