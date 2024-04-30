import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthRoutes } from '@Auth/routes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
