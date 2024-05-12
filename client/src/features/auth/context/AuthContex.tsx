import { createContext } from 'react'
import { useLocalStorage } from 'hooks'
import { AuthContextType, User } from 'types'

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

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}
