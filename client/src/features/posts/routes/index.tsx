import { Route, Routes } from 'react-router-dom'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'

import { Posts } from '@Posts/pages'
import { AppLayout } from 'layout'

export function PostsRoutes() {
  return (
    <>
      <AppLayout
        menuItems={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'nav 1',
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'nav 2',
          },
          {
            key: '3',
            icon: <UploadOutlined />,
            label: 'nav 3',
          },
        ]}
        content={<h1>Content</h1>}
      />
      <Routes>
        <Route path="posts" element={<Posts />} />
      </Routes>
    </>
  )
}
