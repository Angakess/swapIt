import { Route, Routes } from 'react-router-dom'
import { Post, Posts, PostAdd } from '@Posts/pages'
import { AppLayout } from '@Common/layout'

export function PostsRoutes() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/:id" element={<Post />} />
          <Route path="/add" element={<PostAdd />} />
        </Routes>
      </AppLayout>
    </>
  )
}
