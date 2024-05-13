export type UserRole = 'ADMIN' | 'HELPER' | 'EXCHANGER'

export type UserGender = 'MALE' | 'FEMALE' | 'OTHER'

export type UserPermissions = UserRole | 'UNREGISTERED'

export type User = {
  id: number
  first_name: string
  last_name: string
  dni: string
  email: string
  role: UserRole
}

export type AuthContextType = {
  user: User | null
  isLoggedIn: () => boolean
  logIn: (user: User) => void
  logOut: () => void
  getPermission: () => UserPermissions
}

export type Post = {
  id: number
  title: string
  description: string
  category: string
  state: string
  images: string[]
}
