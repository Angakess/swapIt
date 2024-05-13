import { createContext } from 'react'
import { useLocalStorage } from '@Common/hooks'
import { AuthContextType, UserPermissions, User } from '@Common/types'

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('SWAP-IT__auth', null)

  function isLoggedIn() {
    return user !== null
  }

  function logIn(newUser: User) {
    setUser(newUser)
  }

  function logOut() {
    setUser(null)
  }

  function getPermission(): UserPermissions {
    if (user == null) return 'UNREGISTERED'
    return user.role
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, logIn, logOut, getPermission }}
    >
      {children}
    </AuthContext.Provider>
  )
}
