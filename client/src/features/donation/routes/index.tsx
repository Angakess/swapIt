import { Routes, Route } from 'react-router-dom'
import {
  Donation,
} from '@Donation/pages'
import { Page403 } from '@Common/pages/Page403'

export function DonationRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Donation />} />
        <Route path="*" element={<Page403 />} />
    </Routes>
  )
}
