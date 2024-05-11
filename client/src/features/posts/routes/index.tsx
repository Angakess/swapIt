import { Route, Routes } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons'

import { Post, Posts } from '@Posts/pages'
import { AppLayout } from 'layout'

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
          ],
        }}
      >
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/:id" element={<Post />} />
        </Routes>
      </AppLayout>
    </>
  )
}
