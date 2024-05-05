import { Route, Routes } from 'react-router-dom'
import {
  UserOutlined,
  ContactsOutlined,
  ProductOutlined,
  ShopOutlined,
} from '@ant-design/icons'

import { Categories, Exchangers, Helpers, Locals } from '@Admin/pages'
import { AppLayout } from 'layout'
import { MenuInfo } from 'rc-menu/lib/interface'

export function AdminRoutes() {
  

    const handleClick = (info: MenuInfo) => {
        console.log("key: ", info.key)
    }

    return (
    <>
      <AppLayout
        menuItems={[
          {
            key: "helpers",
            title: "helpers",
            icon: <ContactsOutlined />,
            label: 'Ayudantes',
            onClick: handleClick,
            
          },
          {
            key: "exchangers",
            icon: <UserOutlined />,
            label: 'Intercambiadores',
            onClick: handleClick
          },
          {
            key: "locals",
            icon: <ShopOutlined />,
            label: 'Filiales',
            onClick: handleClick
          },
          {
            key: "categories",
            icon: <ProductOutlined />,
            label: 'Categorias',
            onClick: handleClick
          },
        ]}
        header={<h1>Página de administración</h1>}
      >
        <Routes>
          <Route path="/helpers" element={<Helpers />} />
          <Route path="/exchangers" element={<Exchangers />} />
          <Route path="/locals" element={<Locals />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </AppLayout>
    </>
  )
}
