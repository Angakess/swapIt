enum UserRole {
  ADMIN = 'ADMIN',
  HELPER = 'HELPER',
  EXCHANGER = 'EXCHANGER',
}

type User = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  isLoggedIn: () => boolean
  logIn: (user: User) => void
  logOut: () => void
}
