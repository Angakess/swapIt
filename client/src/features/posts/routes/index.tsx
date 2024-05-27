import { Route, Routes } from 'react-router-dom'
import { Post, Posts, MyPosts } from '@Posts/pages'
import { MyTurns } from '@Turns/pages'
import { AppLayout } from '@Common/layout'
import { Page404 } from '@Common/pages'
import { ProtectedRoute } from '@Common/components'

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

          <Route
            path="/my-posts"
            element={<ProtectedRoute allowed={['EXCHANGER']} />}
          >
            <Route path="/my-posts" element={<MyPosts />} />
          </Route>

          <Route
            path="/my-turns"
            element={<ProtectedRoute allowed={['EXCHANGER']} />}
          >
            <Route path="/my-turns" element={<MyTurns />} />
          </Route>

          <Route path="/*" element={<Page404 />} />
        </Route>
      </Routes>
    </AppLayout>
  )
}
