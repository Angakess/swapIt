import { AuthContext } from '@Auth/context'
import { useContext } from 'react'

export function useAuth() {
  return useContext(AuthContext)!
}
