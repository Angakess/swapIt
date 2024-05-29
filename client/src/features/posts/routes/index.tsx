import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'
import { Post, Posts, MyPosts } from '@Posts/pages'
import { Page404 } from '@Common/pages'

export function PostsRoutes() {
  return (
    <Routes>
      <Route
        element={<ProtectedRoute allowed={['ADMIN', 'EXCHANGER', 'HELPER']} />}
      >
        <Route path="/" element={<Posts />} />
        <Route path="/:id" element={<Post />} />
      </Route>

      <Route element={<ProtectedRoute allowed={['EXCHANGER']} />}>
        <Route path="/my-posts" element={<MyPosts />} />
      </Route>

      <Route path="/*" element={<Page404 />} />
    </Routes>
  )
}
