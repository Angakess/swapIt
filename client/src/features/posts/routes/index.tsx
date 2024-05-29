import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@Common/components'
import { AppLayout } from '@Common/layout'
import { Page404 } from '@Common/pages'
import { Post, Posts, MyPosts } from '@Posts/pages'

export function PostsRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute allowed={['ADMIN', 'EXCHANGER', 'HELPER']} />
          }
        >
          <Route path="/" element={<Posts />} />
          <Route path="/:id" element={<Post />} />
        </Route>

        <Route
          path="/my-posts"
          element={<ProtectedRoute allowed={['EXCHANGER']} />}
        >
          <Route path="/my-posts" element={<MyPosts />} />
        </Route>
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </AppLayout>
  )
}
