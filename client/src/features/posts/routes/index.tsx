import { Route, Routes } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons'

import { Post, Posts,PostAdd } from '@Posts/pages'
import { AppLayout } from '@Common/layout'

export function PostsRoutes() {
  return (
    <>
      <AppLayout
        sidebarProps={{
          defaultSelectedKey: '/posts',
          menuItems: [
            {
              key: '/posts',
              label: 'Publicaciones',
              icon: <UploadOutlined />,
            },
            {
              key: '/posts/add',
              label: 'Agregar Publicación',
              icon: <UploadOutlined />,
            }
          ],
        }}
      >
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/:id" element={<Post />} />
          <Route path="/add" element={<PostAdd />} />
        </Routes>
      </AppLayout>
    </>
  )
}
